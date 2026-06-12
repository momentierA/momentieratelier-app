'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ExpenseSchema, type ExpenseFormValues } from '@/schemas/expense'

export async function getExpenses() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('expense_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createExpense(values: ExpenseFormValues) {
  const parsed = ExpenseSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.from('expenses').insert({
    description: parsed.data.description,
    amount: parsed.data.amount,
    category: parsed.data.category,
    expense_date: parsed.data.expense_date,
    supplier: parsed.data.supplier ?? null,
    receipt_url: parsed.data.receipt_url ?? null,
  })
  if (error) return { error: error.message }

  revalidatePath('/financeiro')
  revalidatePath('/')
  return { success: true }
}

export async function updateExpense(id: string, values: ExpenseFormValues) {
  const parsed = ExpenseSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.from('expenses').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/financeiro')
  return { success: true }
}

export async function deleteExpense(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('expenses').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/financeiro')
  revalidatePath('/')
  return { success: true }
}
