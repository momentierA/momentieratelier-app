'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { SaleSchema, type SaleFormValues } from '@/schemas/sale'
import type { SaleWithItems } from '@/lib/supabase/types'

export async function getSales() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sales')
    .select('*, sale_items(id, product_id, momentier_product_id, product_name, quantity, unit_price)')
    .order('sale_date', { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as SaleWithItems[]
}

export async function createSale(values: SaleFormValues) {
  const parsed = SaleSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()

  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .insert({
      sale_date: parsed.data.sale_date,
      payment_method: parsed.data.payment_method,
      order_number: parsed.data.order_number ?? null,
      notes: parsed.data.notes ?? null,
      receipt_url: parsed.data.receipt_url,
    })
    .select('id')
    .single()

  if (saleError) return { error: saleError.message }

  const saleItems = parsed.data.items.map((item) => {
    const isEstoque = item.product_ref.startsWith('e:')
    const isMomentier = item.product_ref.startsWith('m:')
    const uuid = item.product_ref.substring(item.product_ref.indexOf(':') + 1)
    return {
      sale_id: sale.id,
      product_id: isEstoque ? uuid : null,
      momentier_product_id: isMomentier ? uuid : null,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }
  })

  const { error: itemsError } = await supabase.from('sale_items').insert(saleItems)
  if (itemsError) return { error: itemsError.message }

  // Decrementa estoque apenas para produtos do Estoque
  for (const item of saleItems) {
    if (item.product_id) {
      await supabase.rpc('decrement_stock', {
        p_product_id: item.product_id,
        p_qty: item.quantity,
      })
    }
  }

  revalidatePath('/vendas')
  revalidatePath('/')
  return { success: true }
}

export async function getSaleById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sales')
    .select('*, sale_items(id, product_id, momentier_product_id, product_name, quantity, unit_price)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as unknown as SaleWithItems
}

export async function updateSale(id: string, values: SaleFormValues) {
  const parsed = SaleSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()

  const { error: saleError } = await supabase
    .from('sales')
    .update({
      sale_date: parsed.data.sale_date,
      payment_method: parsed.data.payment_method,
      order_number: parsed.data.order_number ?? null,
      notes: parsed.data.notes ?? null,
      receipt_url: parsed.data.receipt_url,
    })
    .eq('id', id)

  if (saleError) return { error: saleError.message }

  await supabase.from('sale_items').delete().eq('sale_id', id)

  const saleItems = parsed.data.items.map((item) => {
    const isEstoque = item.product_ref.startsWith('e:')
    const isMomentier = item.product_ref.startsWith('m:')
    const uuid = item.product_ref.substring(item.product_ref.indexOf(':') + 1)
    return {
      sale_id: id,
      product_id: isEstoque ? uuid : null,
      momentier_product_id: isMomentier ? uuid : null,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }
  })

  const { error: itemsError } = await supabase.from('sale_items').insert(saleItems)
  if (itemsError) return { error: itemsError.message }

  revalidatePath('/vendas')
  revalidatePath('/')
  return { success: true }
}

export async function deleteSale(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('sales').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/vendas')
  revalidatePath('/')
  return { success: true }
}
