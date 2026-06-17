-- Adiciona número do pedido em vendas
ALTER TABLE sales ADD COLUMN IF NOT EXISTS order_number text;

-- Permite product_id nulo (para produtos Momentier)
ALTER TABLE sale_items ALTER COLUMN product_id DROP NOT NULL;

-- Adiciona referência para produto Momentier
ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS momentier_product_id uuid REFERENCES momentier_products(id);

-- Guarda o nome do produto no momento da venda (evita joins duplos)
ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS product_name text;

-- Backfill: preenche product_name dos itens existentes
UPDATE sale_items si
SET product_name = p.name
FROM products p
WHERE si.product_id = p.id AND si.product_name IS NULL;
