'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ProductionOrderSchema, type ProductionOrderFormValues } from '@/schemas/productionOrder'
import type { ProductionOrderWithItems } from '@/lib/supabase/types'

const TABLE = 'production_orders'
const PATH = '/pedidos'

export async function getProductionOrders(): Promise<ProductionOrderWithItems[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, production_order_items(*)')
    .order('delivery_date', { ascending: true })
  if (error) throw error
  return (data ?? []) as unknown as ProductionOrderWithItems[]
}

export async function getProductionOrderById(id: string): Promise<ProductionOrderWithItems> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*, production_order_items(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as unknown as ProductionOrderWithItems
}

export async function createProductionOrder(values: ProductionOrderFormValues) {
  const parsed = ProductionOrderSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { items, ...orderData } = parsed.data

  const { data: order, error } = await supabase.from(TABLE).insert(orderData).select('id').single()
  if (error) return { error: error.message }

  if (items.length > 0) {
    const rows = items.map(item => ({ ...item, order_id: order.id }))
    const { error: itemsError } = await supabase.from('production_order_items').insert(rows)
    if (itemsError) return { error: itemsError.message }
  }

  revalidatePath(PATH)
  return { success: true }
}

export async function updateProductionOrder(id: string, values: ProductionOrderFormValues) {
  const parsed = ProductionOrderSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { items, ...orderData } = parsed.data

  const { error } = await supabase.from(TABLE).update(orderData).eq('id', id)
  if (error) return { error: error.message }

  await supabase.from('production_order_items').delete().eq('order_id', id)
  if (items.length > 0) {
    const rows = items.map(item => ({ ...item, order_id: id }))
    const { error: itemsError } = await supabase.from('production_order_items').insert(rows)
    if (itemsError) return { error: itemsError.message }
  }

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
