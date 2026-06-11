import { z } from 'zod'

export const PurchaseItemSchema = z.object({
  product_id: z.string().uuid('Produto obrigatório'),
  quantity: z.number().int().min(1, 'Quantidade mínima: 1'),
  unit_cost: z.number().min(0, 'Custo inválido'),
})

export const PurchaseSchema = z.object({
  supplier: z.string().optional(),
  notes: z.string().optional(),
  purchase_date: z.string().min(1, 'Data obrigatória'),
  receipt_url: z.string().nullable(),
  items: z.array(PurchaseItemSchema).min(1, 'Adicione pelo menos um produto'),
})

export type PurchaseFormValues = z.infer<typeof PurchaseSchema>
export type PurchaseItemFormValues = z.infer<typeof PurchaseItemSchema>
