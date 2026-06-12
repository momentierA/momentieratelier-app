-- Adiciona campo fornecedor à tabela de despesas
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS supplier text;
