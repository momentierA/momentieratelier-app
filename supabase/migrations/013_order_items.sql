CREATE TABLE IF NOT EXISTS production_order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
  quantity int NOT NULL DEFAULT 1,
  product_name text NOT NULL,
  product_color text,
  personalization boolean DEFAULT false,
  personalization_color text,
  custom_name text,
  font text,
  design text,
  unit_price numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE production_order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_all" ON production_order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
