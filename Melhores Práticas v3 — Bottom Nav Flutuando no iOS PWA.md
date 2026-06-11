# 🔧 Fix Definitivo: Bottom Nav Flutuando no Meio da Tela (iOS PWA)

> **Sintoma:** A barra de navegação inferior aparece no meio da tela ao abrir o app, e só desce pro lugar depois de rolar — ou fica travada no meio independente do scroll.
> **Contexto:** Sempre aparece em PWAs instalados no iPhone via Safari. Pode acontecer no browser também.
> **Histórico:** Custou ~6 versões e múltiplos chats pra descobrir. Nunca mais tentar adivinhar — usar esta receita direto.

---

## As Duas Causas (precisam ser corrigidas JUNTAS)

O bug quase sempre tem **duas causas somadas**. Corrigir só uma não resolve.

### Causa 1 — `height:100%` ou `height:100dvh` travado no body

```css
/* ❌ ERRADO */
html, body { height: 100%; overflow: hidden; }
body { height: 100dvh; }
body { min-height: 100dvh; }
```

O iOS calcula essa altura no momento do load (às vezes com barra de endereço visível). O valor **trava ali**. O container do app não tem a altura real da tela, e qualquer coisa ancorada ao "fundo" aparece no lugar errado. O `100dvh` é pior ainda: recalcula dinamicamente e faz a nav "perseguir" o valor — ela flutua até dar scroll.

**Correção:** `min-height: 100vh` no body, sem travar altura nem overflow. O `100vh` no iOS PWA é o valor estável.

---

### Causa 2 — Nav/FAB/Modal dentro de um container que quebra o `position:fixed`

```html
<!-- ❌ ERRADO: nav dentro do #app -->
<div id="app">
  <div class="topbar">...</div>
  <div class="content">...</div>
  <nav class="tabs">...</nav>      <!-- ← PROBLEMA -->
  <button class="fab">...</button> <!-- ← PROBLEMA -->
</div>
```

`position:fixed` deveria sempre ancorar na janela física — mas se qualquer ancestral tem `transform`, `filter`, `backdrop-filter`, `perspective`, ou `position:relative` com certas combinações, esse ancestral vira o **containing block** e o `fixed` ancora **nele**, não na janela. A nav fica presa dentro do container e aparece no lugar errado.

**Correção:** Nav, FAB, modais e toasts devem ser **filhos diretos do `<body>`** — sem nenhum ancestral que possa sequestrar o `fixed`.

---

## A Receita que Funciona (copiar inteira)

### HTML — estrutura obrigatória

```html
<body>
  <div id="app">
    <header class="topbar">…</header>
    <div class="content" id="content">…</div>
  </div>

  <!-- Tudo que é fixed: FORA do #app, filhos diretos do body -->
  <nav class="tabs">…</nav>
  <button class="fab" id="fab">＋</button>
  <div id="mc"></div>              <!-- container de modais -->
  <div class="toast-wrap"></div>   <!-- toasts -->
</body>
```

### CSS — mínimo que funciona

```css
html {
  overflow-x: hidden;
  touch-action: manipulation;
  -webkit-text-size-adjust: 100%;
}

body {
  min-height: 100vh;   /* 100vh estável — NUNCA height fixo, NUNCA 100dvh */
  margin: 0;
  overflow-x: hidden;
  /* SEM overflow:hidden, SEM display:flex, SEM max-width */
}

#app {
  max-width: 430px;    /* max-width SÓ no conteúdo, nunca no body */
  margin: 0 auto;
  background: var(--bg);
  /* SEM position, SEM height, SEM overflow, SEM transform */
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  padding-top: calc(14px + env(safe-area-inset-top));
}

.content {
  max-width: 430px;
  margin: 0 auto;
  padding: 16px;
  padding-bottom: calc(72px + env(safe-area-inset-bottom) + 20px);
  /* SEM overflow-y, SEM flex:1 — rola com o body naturalmente */
}

/* NAV: filha direta do body, ancora na janela física */
.tabs {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 80;
  padding-bottom: env(safe-area-inset-bottom); /* safe-area UMA vez só */
  /* SEM height fixo — altura vem do padding dos ícones */
}

.tab {
  padding: 10px 4px; /* a altura da nav nasce daqui */
}

/* Desktop: centraliza com translateX, NUNCA com margin:auto */
@media (min-width: 431px) {
  .tabs {
    left: 50%;
    right: auto;
    width: 430px;
    transform: translateX(-50%);
  }
}

/* FAB: também filho direto do body */
.fab {
  position: fixed;
  bottom: calc(72px + env(safe-area-inset-bottom) + 14px);
  right: 18px;
  z-index: 90;
}

@media (min-width: 431px) {
  .fab { right: calc(50% - 430px/2 + 18px); }
}
```

### Hierarquia de z-index (definir desde o início)

```
toast / notificação   200
modal overlay         130
modal                 120
drawer overlay        110
drawer                100
FAB                    90
bottom-nav             80
topbar (sticky)        50
```

---

## O Que NÃO Funciona (já testado)

| Tentativa | Por que não resolve |
|---|---|
| Tirar `position:fixed` da nav e deixar em fluxo normal no `#app` | O `#app` com `height:100%` ainda tem altura instável no iOS — o "fundo" do container não é o fundo da tela |
| `left:50%; transform:translateX(-50%)` com nav dentro do `#app` | O `#app` com `position:relative` pode virar containing block |
| Trocar `height:100dvh` por `height:100vh` no body | Sem tirar `overflow:hidden` e sem mover a nav pra fora do container, não resolve |
| Qualquer fix parcial | O bug tem DUAS causas. Corrigir uma e deixar a outra = bug persiste |

---

## Checklist de Diagnóstico Rápido

Se a bottom-nav estiver flutuando, verificar nesta ordem:

- [ ] O body tem `height:100%` ou `height:*dvh` ou `overflow:hidden`? → remover, usar `min-height:100vh`
- [ ] A nav está dentro de algum container? → mover pra fora, filho direto do `<body>`
- [ ] Algum ancestral da nav tem `transform`, `filter`, `backdrop-filter`, `position:relative` ou `overflow`? → nav precisa estar fora desse elemento
- [ ] A nav tem `height` fixo? → remover; a altura deve vir do `padding` dos itens
- [ ] O `env(safe-area-inset-bottom)` está sendo aplicado duas vezes (na `height` E no `padding`)? → usar em um lugar só

---

## Metatags Obrigatórias no `<head>`

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#SUA_COR_DO_TOPBAR">  <!-- deve bater com o topbar -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Nome do App">
<link rel="apple-touch-icon" href="icons/icon-180.png">
```

> `viewport-fit=cover` é o que ativa `env(safe-area-inset-*)`. Sem ele, todas as variáveis de safe-area retornam zero.

---

## Como Testar Corretamente no iPhone

O iOS tem cache agressivo. Mudança de layout não aparece sem reiniciar o PWA:

1. Subir o arquivo novo no servidor (GitHub Pages, etc.)
2. **Remover** o atalho atual da home screen
3. Abrir no **Safari** (não Chrome), fazer refresh forçado
4. Adicionar à tela de início de novo

---

## Histórico deste Fix

Resolvido no projeto **Gigi's Shop** em maio de 2026, na v10.
Tentativas anteriores (v08 e v09) falharam porque corrigiam apenas uma das duas causas de cada vez.
A solução só funcionou quando as DUAS causas foram corrigidas juntas, seguindo a estrutura da receita acima.
