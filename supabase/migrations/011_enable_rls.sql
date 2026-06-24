-- Habilita RLS em todas as tabelas públicas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE papelaria_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalizados_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cestas_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bbw_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE momentier_products ENABLE ROW LEVEL SECURITY;

-- Políticas: apenas usuários autenticados têm acesso total
CREATE POLICY "authenticated_all" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON purchases FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON purchase_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON sales FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON sale_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON expenses FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON papelaria_products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON personalizados_products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON cestas_products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON bbw_products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON momentier_products FOR ALL TO authenticated USING (true) WITH CHECK (true);
