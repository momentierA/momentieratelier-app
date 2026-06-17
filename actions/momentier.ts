'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ProductLineSchema, type ProductLineFormValues } from '@/schemas/productLine'

const TABLE = 'momentier_products'
const PATH = '/entradas'

export async function getMomentierActiveProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, name, sale_price')
    .eq('active', true)
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getMomentierProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase.from(TABLE).select('*').order('name')
  if (error) throw error
  return data ?? []
}

export async function getMomentierProductById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createMomentierProduct(values: ProductLineFormValues) {
  const parsed = ProductLineSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  const supabase = await createClient()
  const { error } = await supabase.from(TABLE).insert(parsed.data)
  if (error) return { error: error.message }
  revalidatePath(PATH)
  return { success: true }
}

export async function updateMomentierProduct(id: string, values: ProductLineFormValues) {
  const parsed = ProductLineSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  const supabase = await createClient()
  const { error } = await supabase.from(TABLE).update(parsed.data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(PATH)
  return { success: true }
}

export async function toggleMomentierProductActive(id: string, active: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from(TABLE).update({ active }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(PATH)
  return { success: true }
}
