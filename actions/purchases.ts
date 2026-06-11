'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { PurchaseSchema, type PurchaseFormValues } from '@/schemas/purchase'
import type { PurchaseWithItems } from '@/lib/supabase/types'

export async function getPurchases() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('purchases')
    .select('*, purchase_items(*, products(name, sku))')
    .order('purchase_date', { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as PurchaseWithItems[]
}

export async function createPurchase(values: PurchaseFormValues) {
  const parsed = PurchaseSchema.safeParse(values)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()

  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .insert({
      supplier: parsed.data.supplier ?? null,
      notes: parsed.data.notes ?? null,
      purchase_date: parsed.data.purchase_date,
      receipt_url: parsed.data.receipt_url,
    })
    .select('id')
    .single()

  if (purchaseError) return { error: purchaseError.message }

  const { error: itemsError } = await supabase.from('purchase_items').insert(
    parsed.data.items.map((item) => ({ ...item, purchase_id: purchase.id }))
  )
  if (itemsError) return { error: itemsError.message }

  // Incrementar estoque de cada produto
  for (const item of parsed.data.items) {
    await supabase.rpc('increment_stock', {
      p_product_id: item.product_id,
      p_qty: item.quantity,
    })
  }

  revalidatePath('/entradas')
  revalidatePath('/produtos')
  revalidatePath('/')
  return { success: true }
}

export async function deletePurchase(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('purchases').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/entradas')
  return { success: true }
}
