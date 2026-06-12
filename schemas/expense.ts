import { z } from 'zod'

export const ExpenseSchema = z.object({
  description: z.string().min(1, 'Descrição obrigatória'),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  category: z.enum(['shipping', 'taxas', 'operacional', 'insumos', 'outros']),
  expense_date: z.string().min(1, 'Data obrigatória'),
  receipt_url: z.string().nullable(),
})

export type ExpenseFormValues = z.infer<typeof ExpenseSchema>
