# MAPA DO PROJETO — Cozy Anchor v1.0.0

> Cole este arquivo no início de cada chat novo para ir direto no arquivo certo.

## Visão geral

Sistema de gestão para pequena empresa. Interface em português, moeda USD.
Stack: Next.js 16 · Tailwind v4 · shadcn/ui · Supabase · Vercel · Zod · React Query

---

## Funcionalidade → Arquivo

| Funcionalidade | Arquivo |
|---|---|
| Cores e tema visual | `app/globals.css` — variáveis CSS em `:root` |
| Paleta de cores (tokens) | `app/globals.css` — bloco `@theme inline` |
| Auth middleware (redirect) | `middleware.ts` |
| React Query provider | `components/providers.tsx` |
| Tipos do Supabase | `lib/supabase/types.ts` |
| Supabase (client-side) | `lib/supabase/client.ts` |
| Supabase (server-side) | `lib/supabase/server.ts` |
| **Schemas de validação** | |
| → Produto | `schemas/product.ts` |
| → Venda | `schemas/sale.ts` |
| → Entrada de estoque | `schemas/purchase.ts` |
| → Despesa | `schemas/expense.ts` |
| **Server Actions** | |
| → Produtos (CRUD) | `actions/products.ts` |
| → Vendas | `actions/sales.ts` |
| → Entradas de estoque | `actions/purchases.ts` |
| → Despesas | `actions/expenses.ts` |
| **Layout** | |
| Sidebar de navegação | `components/layout/Sidebar.tsx` |
| Layout protegido (auth) | `app/(admin)/layout.tsx` |
| **Componentes compartilhados** | |
| Upload de comprovantes | `components/shared/ReceiptUpload.tsx` |
| Card de métrica | `components/dashboard/MetricCard.tsx` |
| **Páginas** | |
| Login | `app/(auth)/login/page.tsx` |
| Dashboard | `app/(admin)/page.tsx` |
| Lista de produtos | `app/(admin)/produtos/page.tsx` |
| Formulário de produto | `app/(admin)/produtos/ProductForm.tsx` |
| Novo produto | `app/(admin)/produtos/novo/page.tsx` |
| Editar produto | `app/(admin)/produtos/[id]/editar/page.tsx` |
| Ativar/Inativar produto | `app/(admin)/produtos/ToggleActiveButton.tsx` |
| Lista de vendas | `app/(admin)/vendas/page.tsx` |
| Formulário de venda | `app/(admin)/vendas/SaleForm.tsx` |
| Nova venda | `app/(admin)/vendas/nova/page.tsx` |
| Lista de entradas | `app/(admin)/entradas/page.tsx` |
| Formulário de entrada | `app/(admin)/entradas/PurchaseForm.tsx` |
| Nova entrada | `app/(admin)/entradas/nova/page.tsx` |
| Lista de despesas | `app/(admin)/financeiro/page.tsx` |
| Formulário de despesa | `app/(admin)/financeiro/ExpenseForm.tsx` |
| Nova despesa | `app/(admin)/financeiro/nova/page.tsx` |
| Relatórios | `app/(admin)/relatorios/page.tsx` |
| **Banco de dados** | |
| Schema SQL | `supabase/migrations/001_schema.sql` |
| RLS policies | `supabase/migrations/002_rls.sql` |
| Storage buckets | `supabase/migrations/003_storage.sql` |
| Credenciais (local) | `.env.local` — nunca commitar |

---

## Versão atual

`v1.0.0` — 2026-05-30 — estrutura inicial completa

---

## Para subir em produção

1. Criar projeto no Supabase
2. Rodar as migrations: `supabase db push`
3. Preencher `.env.local` com URL e anon key do Supabase
4. Push no GitHub → Vercel faz deploy automático
5. Adicionar as env vars no painel da Vercel
