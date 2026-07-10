import { z } from 'zod'

const PaymentMethod = z.enum(['dinheiro', 'pix', 'cartão', 'outro']).nullable()

export const ProductionOrderSchema = z.object({
  customer_name: z.string().min(1, 'Nome obrigatório'),
  customer_phone: z.string().nullable(),
  customer_email: z.string().nullable(),
  customer_birthday: z.string().nullable(),
  order_number: z.string().nullable(),
  order_date: z.string().min(1, 'Data do pedido obrigatória'),
  delivery_date: z.string().nullable(),
  delivery_type: z.enum(['entrega', 'nao', 'pickup']),
  order_source: z.enum(['etsy', 'instagram', 'facebook', 'whatsapp']).nullable(),
  total_amount: z.number().min(0),
  payment1_amount: z.number().min(0).nullable(),
  payment1_date: z.string().nullable(),
  payment1_method: PaymentMethod,
  payment2_amount: z.number().min(0).nullable(),
  payment2_date: z.string().nullable(),
  payment2_method: PaymentMethod,
  notes: z.string().nullable(),
})

export type ProductionOrderFormValues = z.infer<typeof ProductionOrderSchema>
