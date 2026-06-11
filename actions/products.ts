'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ProductSchema, type ProductFormValues } from '@/schemas/product'

export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getActiveProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, name, sku, stock_quantity, sale_price, cost_price')
    .eq('active', true)
    .order('name')
  if (error) throw error
  return data ?? []
}

export async function getProductById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createProduct(values: ProductFormValues) {
  const parsed = ProductSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.from('products').insert(parsed.data)
  if (error) return { error: error.message }

  revalidatePath('/produtos')
  return { success: true }
}

export async function updateProduct(id: string, values: ProductFormValues) {
  const parsed = ProductSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { error } = await supabase.from('products').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/produtos')
  return { success: true }
}

export async function toggleProductActive(id: string, active: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('products').update({ active }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/produtos')
  return { success: true }
}
