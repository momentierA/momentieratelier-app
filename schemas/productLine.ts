import { z } from 'zod'

export const ProductLineSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  description: z.string().nullable(),
  cost_price: z.number().min(0),
  sale_price: z.number().min(0),
  stock_quantity: z.number().int().min(0),
  low_stock_threshold: z.number().int().min(0),
  image_url: z.string().url('URL inválida').nullable(),
  active: z.boolean(),
})

export type ProductLineFormValues = z.infer<typeof ProductLineSchema>
