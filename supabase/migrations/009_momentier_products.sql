CREATE TABLE IF NOT EXISTS momentier_products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  cost_price numeric(10,2) DEFAULT 0,
  sale_price numeric(10,2) DEFAULT 0,
  stock_quantity int DEFAULT 0,
  low_stock_threshold int DEFAULT 5,
  image_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
