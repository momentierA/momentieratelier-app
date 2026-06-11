-- Habilitar RLS em todas as tabelas
alter table products enable row level security;
alter table purchases enable row level security;
alter table purchase_items enable row level security;
alter table sales enable row level security;
alter table sale_items enable row level security;
alter table expenses enable row level security;

-- Políticas: apenas usuários autenticados têm acesso total
create policy "auth_all" on products for all to authenticated using (true) with check (true);
create policy "auth_all" on purchases for all to authenticated using (true) with check (true);
create policy "auth_all" on purchase_items for all to authenticated using (true) with check (true);
create policy "auth_all" on sales for all to authenticated using (true) with check (true);
create policy "auth_all" on sale_items for all to authenticated using (true) with check (true);
create policy "auth_all" on expenses for all to authenticated using (true) with check (true);
