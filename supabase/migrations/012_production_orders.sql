CREATE TABLE IF NOT EXISTS production_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  customer_phone text,
  customer_email text,
  customer_birthday date,
  order_number text,
  order_date date NOT NULL,
  delivery_date date,
  delivery_type text NOT NULL DEFAULT 'pickup',
  order_source text,
  total_amount numeric(10,2) DEFAULT 0,
  payment1_amount numeric(10,2),
  payment1_date date,
  payment1_method text,
  payment2_amount numeric(10,2),
  payment2_date date,
  payment2_method text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_all" ON production_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
