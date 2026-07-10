'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ProductionOrderSchema, type ProductionOrderFormValues } from '@/schemas/productionOrder'
import type { ProductionOrder } from '@/lib/supabase/types'

const TABLE = 'production_orders'
const PATH = '/pedidos'

export async function getProductionOrders(): Promise<ProductionOrder[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('delivery_date', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getProductionOrderById(id: string): Promise<ProductionOrder> {
  const supabase = await createClient()
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createProductionOrder(values: ProductionOrderFormValues) {
  const parsed = ProductionOrderSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  const supabase = await createClient()
  const { error } = await supabase.from(TABLE).insert(parsed.data)
  if (error) return { error: error.message }
  revalidatePath(PATH)
  return { success: true }
}

export async function updateProductionOrder(id: string, values: ProductionOrderFormValues) {
  const parsed = ProductionOrderSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  const supabase = await createClient()
  const { error } = await supabase.from(TABLE).update(parsed.data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(PATH)
  return { success: true }
}

export async function deleteProductionOrder(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath(PATH)
  return { success: true }
}
