CREATE TABLE IF NOT EXISTS papelaria_products (
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

CREATE TABLE IF NOT EXISTS personalizados_products (
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

CREATE TABLE IF NOT EXISTS cestas_products (
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

CREATE TABLE IF NOT EXISTS bbw_products (
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
