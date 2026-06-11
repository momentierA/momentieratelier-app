-- Bucket para recibos e fotos de produtos
insert into storage.buckets (id, name, public) values ('receipts', 'receipts', false);
insert into storage.buckets (id, name, public) values ('products', 'products', true);

-- Recibos: apenas usuários autenticados podem ler/escrever
create policy "auth_read_receipts" on storage.objects for select to authenticated using (bucket_id = 'receipts');
create policy "auth_insert_receipts" on storage.objects for insert to authenticated with check (bucket_id = 'receipts');
create policy "auth_delete_receipts" on storage.objects for delete to authenticated using (bucket_id = 'receipts');

-- Fotos de produtos: leitura pública, escrita autenticada
create policy "public_read_products" on storage.objects for select using (bucket_id = 'products');
create policy "auth_insert_products" on storage.objects for insert to authenticated with check (bucket_id = 'products');
create policy "auth_update_products" on storage.objects for update to authenticated using (bucket_id = 'products');
create policy "auth_delete_products" on storage.objects for delete to authenticated using (bucket_id = 'products');
