import { z } from 'zod'

export const SaleItemSchema = z.object({
  product_id: z.string().uuid('Produto obrigatório'),
  quantity: z.number().int().min(1, 'Quantidade mínima: 1'),
  unit_price: z.number().min(0, 'Preço inválido'),
})

export const SaleSchema = z.object({
  sale_date: z.string().min(1, 'Data obrigatória'),
  payment_method: z.enum(['dinheiro', 'pix', 'cartão', 'outro']),
  notes: z.string().optional(),
  receipt_url: z.string().nullable(),
  items: z.array(SaleItemSchema).min(1, 'Adicione pelo menos um produto'),
})

export type SaleFormValues = z.infer<typeof SaleSchema>
export type SaleItemFormValues = z.infer<typeof SaleItemSchema>
