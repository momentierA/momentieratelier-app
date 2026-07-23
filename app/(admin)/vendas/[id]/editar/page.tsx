import { notFound } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { getSaleById, updateSale } from '@/actions/sales'
import { getActiveProducts } from '@/actions/products'
import { getMomentierActiveProducts } from '@/actions/momentier'
import { getActivePapelaria } from '@/actions/papelaria'
import { getActivePersonalizados } from '@/actions/personalizados'
import { getActiveCestas } from '@/actions/cestas'
import { getActiveBBW } from '@/actions/bbw'
import { SaleForm } from '../../SaleForm'
import type { SaleFormValues } from '@/schemas/sale'

export default async function EditarVendaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [sale, estoqueProducts, momentierProducts, papelariaProducts, personalizadosProducts, cestasProducts, bbwProducts] = await Promise.all([
    getSaleById(id).catch(() => null),
    getActiveProducts(),
    getMomentierActiveProducts(),
    getActivePapelaria(),
    getActivePersonalizados(),
    getActiveCestas(),
    getActiveBBW(),
  ])
  if (!sale) notFound()

  const defaultItems = sale.sale_items.map(item => ({
    product_ref: item.product_id ? `e:${item.product_id}` : item.momentier_product_id ? `m:${item.momentier_product_id}` : '',
    product_name: item.product_name ?? '',
    quantity: item.quantity,
    unit_price: item.unit_price,
  }))

  async function handleUpdate(values: SaleFormValues) {
    'use server'
    return updateSale(id, values)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-brand-red p-5 text-white flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <ShoppingCart size={22} />
        </div>
        <div>
          <p className="text-xs text-white/60 uppercase tracking-wider">Vendas</p>
          <h1 className="text-xl font-bold">Editar venda</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <SaleForm
          estoqueProducts={estoqueProducts}
          momentierProducts={momentierProducts}
          papelariaProducts={papelariaProducts}
          personalizadosProducts={personalizadosProducts}
          cestasProducts={cestasProducts}
          bbwProducts={bbwProducts}
          saleId={id}
          defaultValues={{
            sale_date: sale.sale_date,
            payment_method: sale.payment_method,
            order_number: sale.order_number,
            notes: sale.notes ?? '',
            receipt_url: sale.receipt_url,
            items: defaultItems,
          }}
          onSave={handleUpdate}
        />
      </div>
    </div>
  )
}
