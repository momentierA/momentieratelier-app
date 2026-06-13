'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ProductLineSchema, type ProductLineFormValues } from '@/schemas/productLine'

const TABLE = 'bbw_products'
const PATH = '/produtos/bbw'

export async function getBBW() {
  const supabase = await createClient()
  const { data, error } = await supabase.from(TABLE).select('*').order('name')
  if (error) throw error
  return data ?? []
}

export async function getBBWById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createBBW(values: ProductLineFormValues) {
  const parsed = ProductLineSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  const supabase = await createClient()
  const { error } = await supabase.from(TABLE).insert(parsed.data)
  if (error) return { error: error.message }
  revalidatePath(PATH)
  return { success: true }
}

export async function updateBBW(id: string, values: ProductLineFormValues) {
  const parsed = ProductLineSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  const supabase = await createClient()
  const { error } = await supabase.from(TABLE).update(parsed.data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(PATH)
  return { success: true }
}

export async function toggleBBWActive(id: string, active: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from(TABLE).update({ active }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(PATH)
  return { success: true }
}
