import { notFound } from 'next/navigation'
import { ClipboardList } from 'lucide-react'
import { getProductionOrderById, updateProductionOrder } from '@/actions/productionOrders'
import { OrderForm } from '../../OrderForm'
import type { ProductionOrderFormValues } from '@/schemas/productionOrder'

export default async function EditarPedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getProductionOrderById(id).catch(() => null)
  if (!order) notFound()

  async function handleUpdate(values: ProductionOrderFormValues) {
    'use server'
    return updateProductionOrder(id, values)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-brand-red p-5 text-white flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <ClipboardList size={22} />
        </div>
        <div>
          <p className="text-xs text-white/60 uppercase tracking-wider">Pedidos em produção</p>
          <h1 className="text-xl font-bold">{order.customer_name}</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <OrderForm
          orderId={id}
          defaultValues={{
            customer_name: order.customer_name,
            customer_phone: order.customer_phone,
            customer_email: order.customer_email,
            customer_birthday: order.customer_birthday,
            order_number: order.order_number,
            order_date: order.order_date,
            delivery_date: order.delivery_date,
            delivery_type: order.delivery_type as ProductionOrderFormValues['delivery_type'],
            order_source: order.order_source as ProductionOrderFormValues['order_source'],
            total_amount: order.total_amount,
            payment1_amount: order.payment1_amount,
            payment1_date: order.payment1_date,
            payment1_method: order.payment1_method as ProductionOrderFormValues['payment1_method'],
            payment2_amount: order.payment2_amount,
            payment2_date: order.payment2_date,
            payment2_method: order.payment2_method as ProductionOrderFormValues['payment2_method'],
            notes: order.notes,
            items: order.production_order_items.map(i => ({
              quantity: i.quantity,
              product_name: i.product_name,
              product_color: i.product_color,
              personalization: i.personalization,
              personalization_color: i.personalization_color as ProductionOrderFormValues['items'][0]['personalization_color'],
              custom_name: i.custom_name,
              font: i.font as ProductionOrderFormValues['items'][0]['font'],
              design: i.design as ProductionOrderFormValues['items'][0]['design'],
              unit_price: i.unit_price,
            })),
          }}
          onSave={handleUpdate}
        />
      </div>
    </div>
  )
}
