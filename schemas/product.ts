import { z } from 'zod'

export const ProductSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  sku: z.string().min(1, 'SKU obrigatório'),
  image_url: z.string().url('URL inválida').nullable(),
  stock_quantity: z.number().int().min(0, 'Quantidade não pode ser negativa'),
  cost_price: z.number().min(0, 'Preço de custo inválido'),
  sale_price: z.number().min(0, 'Preço de venda inválido'),
  low_stock_threshold: z.number().int().min(0),
  active: z.boolean(),
  category: z.string().nullable().optional(),
  supplier: z.string().nullable().optional(),
  supplier_link: z.string().nullable().optional(),
})

export type ProductFormValues = z.infer<typeof ProductSchema>
