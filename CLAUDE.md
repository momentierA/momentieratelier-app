# Momentier Atelier — Guia para Claude Code

## O que é

Sistema de gestão para pequena empresa: estoque, vendas, entradas, despesas e relatórios.
Interface em **português**, moeda em **USD**. Usuário único (dono).

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Estilo | Tailwind CSS v4 + shadcn/ui |
| Backend / DB | Supabase (Postgres + Auth + Storage) |
| Deploy | Vercel (via GitHub) |
| Validação | Zod + React Hook Form |
| Data fetching | React Query (TanStack) |

## Paleta de cores

```css
--color-brand-red:      #8A2822   /* primary, CTAs, active nav */
--color-brand-red-dark: #6B1B16   /* hover */
--color-brand-cream:    #FDF8ED   /* background */
--color-brand-brown:    #713520   /* texto secundário, ícones */
```

Cores definidas em `app/globals.css`. Usar sempre `bg-brand-red`, `text-brand-brown`, etc. Nunca hardcoded.

## Arquitetura

- **Server Components** fazem fetch de dados diretamente com `lib/supabase/server.ts`
- **Mutações** via Server Actions em `actions/` — sempre chamam `revalidatePath` no fim
- **Formulários** usam React Hook Form + Zod resolver, chamam server action no `onSubmit`
- **Upload de arquivos** via `components/shared/ReceiptUpload.tsx` → Supabase Storage
- **Controle de estoque** via RPCs atômicas: `increment_stock` / `decrement_stock`
- **Auth** protegida pelo `middleware.ts` + dupla verificação no `(admin)/layout.tsx`

## Convenções

- Formulários Client Components (`'use client'`) — pages são Server Components
- `useTransition` para chamar server actions sem bloquear a UI
- Valores monetários: `numeric(10,2)` no banco, formatar com `Intl.NumberFormat('en-US', { currency: 'USD' })`
- Datas: salvar como `date` (YYYY-MM-DD), evitar fuso com `+ 'T12:00:00'` ao exibir
- Buckets Supabase: `receipts` (privado) e `products` (público)

## Estrutura de pastas

```
app/
  (auth)/login/         → /login
  (admin)/              → layout protegido com Sidebar
    page.tsx            → / (Dashboard)
    produtos/           → /produtos
    vendas/             → /vendas
    entradas/           → /entradas
    financeiro/         → /financeiro
    relatorios/         → /relatorios
actions/                → Server Actions por domínio
schemas/                → Zod schemas por domínio
lib/supabase/           → client, server, types
components/
  layout/Sidebar.tsx
  dashboard/MetricCard.tsx
  shared/ReceiptUpload.tsx
  ui/                   → shadcn/ui (não editar diretamente)
supabase/migrations/    → SQL para rodar no Supabase
```

## Setup local

```bash
npm install
# Preencher .env.local com as credenciais do Supabase
npm run dev
```

## Para subir nova versão

1. Fazer as alterações
2. Atualizar versão em `MAPA_DO_PROJETO.md`
3. `git add . && git commit -m "descrição do que mudou"`
4. `git push` → Vercel faz o deploy automaticamente
