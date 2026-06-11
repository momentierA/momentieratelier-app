-- Produtos
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text not null unique,
  image_url text,
  stock_quantity integer not null default 0,
  cost_price numeric(10,2) not null,
  sale_price numeric(10,2) not null,
  low_stock_threshold integer not null default 5,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Entradas (compras de estoque)
create table purchases (
  id uuid primary key default gen_random_uuid(),
  supplier text,
  notes text,
  purchase_date date not null,
  receipt_url text,
  created_at timestamptz not null default now()
);

create table purchase_items (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references purchases(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity integer not null check (quantity > 0),
  unit_cost numeric(10,2) not null
);

-- Vendas
create table sales (
  id uuid primary key default gen_random_uuid(),
  sale_date date not null,
  payment_method text not null default 'outro',
  notes text,
  receipt_url text,
  created_at timestamptz not null default now()
);

create table sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references sales(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null
);

-- Despesas
create table expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  amount numeric(10,2) not null,
  category text not null default 'outros',
  expense_date date not null,
  receipt_url text,
  created_at timestamptz not null default now()
);

-- RPCs para controle atômico de estoque
create or replace function increment_stock(p_product_id uuid, p_qty integer)
returns void language plpgsql as $$
begin
  update products set stock_quantity = stock_quantity + p_qty where id = p_product_id;
end;
$$;

create or replace function decrement_stock(p_product_id uuid, p_qty integer)
returns void language plpgsql as $$
begin
  update products
  set stock_quantity = greatest(0, stock_quantity - p_qty)
  where id = p_product_id;
end;
$$;
