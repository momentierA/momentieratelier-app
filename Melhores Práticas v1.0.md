# 📐 Melhores Práticas para Criação de Apps — v1.0

> Checklist de regras e padrões a seguir em **todo e qualquer app** que eu for criar no futuro.
> Sempre revisar esta lista antes de começar um projeto novo.
>
> **Versões anteriores:** v1 e v2 foram consolidadas aqui. Tudo relacionado ao bug de bottom nav flutuando no iOS está no **`Melhores Práticas v3`** — não repetido aqui.

---

## 1. Idioma e Interface

- **Idioma do app:** definir desde o início (ex: inglês para o público-alvo, mesmo que conversemos em português).
- **Mobile-first:** o app deve ser projetado primeiro para o celular, com toques confortáveis e layout que cabe na tela sem rolagem horizontal.
- **Proibir zoom:** desabilitar pinch-to-zoom e duplo-toque-zoom via `<meta name="viewport">` com `user-scalable=no, maximum-scale=1.0`.

---

## 2. Estrutura e Organização do Código (arquitetura modular)

**Filosofia:** nada de `index.html` gigante. Separar por **setores** — cada tela = 1 arquivo próprio. Editar uma tela mexe em 1 arquivo só, nunca no app inteiro.

- **Pasta `shared/`** com o que é comum (cores, config, login). Áreas diferentes (ex: admin e usuário) ficam em pastas separadas, dividindo a `shared/`.
- **1 repositório só. 1 backend só** — a separação é por permissões, não por projeto.
- **`config.js` separado:** versão + conexão do backend (URL + `anon key`) + regras de negócio num lugar isolado.
- **Cores só no `theme.css`** via CSS variables — nada de cor hardcoded nas telas.
- **Footer dinâmico** que lê a versão do `config.js` automaticamente.

### Estrutura de pastas (modelo)

```
meu-app/
├── shared/
│   ├── css/theme.css        # TODAS as cores num lugar (CSS variables)
│   └── js/
│       ├── config.js        # VERSÃO + conexão backend + regras de negócio
│       └── auth.js          # login (se houver)
├── [area1]/                 # ex: admin
│   ├── index.html
│   └── js/
│       ├── app.js           # navegação + roteador
│       └── [tela].js        # 1 arquivo por tela
├── [area2]/                 # ex: cliente/usuário
│   └── (mesma ideia)
├── MAPA_DO_PROJETO.md       # mapa "onde mexo pra X" (ESSENCIAL p/ economizar tokens)
└── README.md
```

### Convenções obrigatórias

1. Cada tela é um **objeto JS com método `.render(container)`**.
2. Controle de **versão num lugar só** (`config.js`). Numeração `MAIOR.MENOR.CORREÇÃO`.
3. **Sempre entregar o arquivo completo** pronto pra colar, dizendo **quais arquivos mudaram** a cada versão.
4. **Validar a sintaxe** (e testar a lógica de cálculos) antes de entregar.
5. Manter um **`MAPA_DO_PROJETO.md` atualizado**: tabela "funcionalidade → arquivo".

### Economizar tokens (importante)

- No começo de cada chat novo, colar o `MAPA_DO_PROJETO.md`.
- Usar o mapa pra ir **direto no arquivo certo**, sem reler o projeto todo.
- Só pedir o conteúdo de um arquivo quando realmente precisar dele.

### Antes de codar

- Fazer **poucas perguntas de cada vez** (usar botões/opções) pra alinhar o que o usuário quer — principalmente **regras de negócio** — antes de escrever código.
- Se algo tiver risco (segurança, dinheiro, dados), **avisar honestamente**.

---

## 3. Versionamento

- **Toda mudança = nova versão.** A cada alteração:
  1. Atualizar o número da versão **no footer** (visível pro usuário).
  2. Atualizar o número da versão **no comentário do topo do `index.html`**.
- Formato: **versionamento semântico** → `vMAIOR.MENOR.CORREÇÃO` (ex: `v1.4.2`).
- **Nome do arquivo entregue versionado:** ao entregar, nomear `index-vN.html` (ex: `index-v10.html`) pra ter histórico local. Na hora de subir no servidor, renomear pra `index.html`.
- **A data no footer deve ser a data real da entrega** — conferir o dia atual, não repetir uma data antiga por hábito.
- **Commit + push a cada mudança:** após atualizar a versão, fazer commit no GitHub com mensagem clara descrevendo o que foi feito e fazer push — o Vercel faz o deploy automaticamente.

---

## 4. Cache e Atualização

- **Botão visual de "Atualizar":** incluir um botão claro na interface que **força a atualização do app**, ignorando o cache do navegador (cache-busting via query param, limpeza de service worker se houver).
- Garantir que o usuário sempre consiga puxar a versão mais nova sem ficar preso numa versão antiga em cache.

---

## 5. PWA — Setup Básico

> ⚠️ Para a estrutura de layout (body, nav, conteúdo, safe-area), consultar o **`Melhores Práticas v3`** — o receituário completo está lá.

### Metatags obrigatórias no `<head>`

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#SUA_COR_DO_TOPBAR">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Nome do App">
<link rel="apple-touch-icon" href="icons/icon-180.png">
```

- `viewport-fit=cover` ativa `env(safe-area-inset-*)`. Sem ele, todas as variáveis de safe-area retornam zero.
- `theme-color` **deve bater com a cor do topbar**. Se não bater, a status bar fica destoante no PWA instalado.

### Ícone da home screen

- Tamanho: **180×180px PNG** (mínimo). Gerar também 120, 152, 167, 192, 512, 1024 para cobrir todos os dispositivos.
- **Fundo sólido** — transparência vira preto no iOS.
- O iOS arredonda os cantos sozinho — não precisa arredondar a imagem.
- Guardar em pasta `icons/` separada da raiz.

### Testar no iPhone (cache agressivo do iOS)

1. Subir o arquivo novo no servidor (ex: GitHub Pages).
2. **Remover** o atalho atual da home screen.
3. Abrir no **Safari** (não Chrome), fazer refresh forçado.
4. Adicionar à tela de início de novo.

> Mudança de `theme-color` e ícone só aparecem plenamente como PWA instalado, não no Safari normal.

---

## 6. Backend e Conexão

- **Backend definido desde o início** (ex: Supabase).
- Credenciais sempre no `config.js` — nunca hardcoded no HTML ou exposto publicamente além da `anon key`.
- Pensar na **estrutura de dados** (tabelas, relações) antes de codar a interface.

---

## 7. Visual e Design

- **Seguir a paleta de cores definida** para o projeto — identidade visual consistente.
- **Cores só no `theme.css`** via CSS variables. Nenhuma tela usa cor hardcoded.
- Manter consistência visual entre todas as telas/módulos.

---

## 8. Regras de Negócio

- **Mapear as regras de negócio antes de começar a codar.** Cada app tem suas particularidades (preços, prazos, exceções) — documentar tudo isso primeiro evita retrabalho.

---

## 9. Stack Recomendado para Apps Web Modernos

> Para apps mais complexos que precisam de rotas, autenticação, banco de dados e deploy profissional — usar esta stack em vez de vanilla HTML.
>
> **Nota:** O app Finance usa vanilla HTML (PWA sem build step). Para projetos novos com mais complexidade, preferir esta stack.

| Camada | Tecnologia | Por quê |
|---|---|---|
| Framework | **Next.js** | React com roteamento, SSR/SSG, API routes — tudo num lugar só |
| Estilo | **Tailwind CSS** | Classes utilitárias, sem CSS custom, rápido de implementar |
| Componentes | **shadcn/ui** | Componentes prontos (botões, modais, forms) baseados em Radix + Tailwind — copia só o que precisa, sem dependência engessada |
| Backend / DB | **Supabase** | Postgres gerenciado, auth, realtime, storage — já usamos no Finance |
| Deploy | **Vercel** | Deploy automático a cada push no GitHub, preview por PR, CDN global |
| Validação | **Zod** | Schema validation TypeScript-first — valida forms, API responses, env vars |
| Data fetching | **React Query** (TanStack Query) | Cache, loading states, refetch automático — elimina `useEffect` para chamadas de API |
| Versionamento | **GitHub** | Repositório, histórico, CI/CD via Vercel |

### Como iniciar um projeto com essa stack

```bash
npx create-next-app@latest meu-app --typescript --tailwind --eslint --app
cd meu-app
npx shadcn@latest init
npm install @supabase/supabase-js @tanstack/react-query zod
```

### Convenções obrigatórias nessa stack

- **Variáveis de ambiente** em `.env.local` — nunca hardcoded. Usar `NEXT_PUBLIC_` só para o que o browser precisa ver.
- **Zod para validar tudo na borda:** forms (com react-hook-form + zod), respostas de API, variáveis de ambiente.
- **React Query para toda chamada ao Supabase** — evitar `useState` + `useEffect` manual para dados assíncronos.
- **shadcn/ui:** rodar `npx shadcn add [componente]` pra adicionar só o que usar. Os componentes ficam em `components/ui/` e são editáveis.
- **Vercel:** conectar o repositório GitHub uma vez — deploy automático a cada push na `main`.

---

## ✅ Checklist Rápido (antes de entregar qualquer app)

- [ ] Idioma do app definido
- [ ] Mobile-first / pronto pra iPhone
- [ ] Zoom desabilitado
- [ ] Código separado por setores/módulos
- [ ] `config.js` com versão, URL e chave do backend
- [ ] Versão visível no footer + comentário no topo do `index.html`
- [ ] Data do footer é a data real da entrega
- [ ] Botão de "Atualizar" que ignora cache
- [ ] Estrutura de layout PWA seguindo `Melhores Práticas v3`
- [ ] `viewport-fit=cover` no viewport
- [ ] `theme-color` batendo com a cor do topbar
- [ ] `apple-touch-icon` 180×180 com fundo sólido, em `icons/`
- [ ] Testado como PWA instalado (remover atalho → Safari → readicionar)
- [ ] Paleta de cores aplicada, cores só em CSS variables
- [ ] Regras de negócio mapeadas e documentadas
- [ ] `MAPA_DO_PROJETO.md` criado e atualizado

---

## 📋 Template para Pedir um App Novo

> Cole isto no começo de um chat novo quando quiser criar um app novo. Preencha os `[ ]`.

```
Quero criar um app web seguindo a arquitetura modular das minhas melhores
práticas (não um index.html gigante): separado por setores, pasta shared/
com o comum, 1 repositório, 1 backend (separação por permissões), cores só
no theme.css, versão no config.js com footer dinâmico, e um MAPA_DO_PROJETO.md
pra economizar tokens. Antes de codar, me faça poucas perguntas por vez (com
botões) pra alinhar as regras de negócio, e me avise se algo tiver risco.
Siga também as Melhores Práticas v3 para o layout PWA (bottom-nav, body, safe-area).

MEU APP:
- Nome: [   ]
- O que faz: [   ]
- Quem usa (áreas/perfis): [ ex: admin + cliente ]
- Idioma(s): [   ]
- Onde roda: [ celular / desktop / ambos ]
- Backend: [ ex: Supabase / nenhum / outro ]
- Telas que imagino: [ liste por área ]
- Regras de negócio principais: [   ]
```

---

## 📎 Exemplo de Referência — App de Marmitas

> Pedido original que serviu de base para estas práticas. Guardado como exemplo de como descrever um app.

**Objetivo:** App para **controle e venda de marmitas** e **visualização do menu**.

**Especificações técnicas:**
- App em **inglês**, proibir zoom, pronto para iPhone.
- Após a primeira conexão, sempre enviar o `config.js` com URL e anon key do Supabase.
- Botão visual de atualizar que força atualização ignorando o cache.
- App separado por setores, pra editar cada área de forma independente.
- A cada mudança: trocar a versão no footer e no comentário do topo do `index.html`.

**Regras de negócio:**
- Toda marmita é feita um dia antes.
- Marmitas vendidas de segunda a sexta → pedidos de domingo a quinta.
- Preços: Individual $14 · Semana completa (5 dias) $12/marmita · Especiais $15.
