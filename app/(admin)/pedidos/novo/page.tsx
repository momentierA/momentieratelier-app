import { ClipboardList } from 'lucide-react'
import { createProductionOrder } from '@/actions/productionOrders'
import { OrderForm } from '../OrderForm'

export default function NovoPedidoPage() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-brand-red p-5 text-white flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <ClipboardList size={22} />
        </div>
        <div>
          <p className="text-xs text-white/60 uppercase tracking-wider">Pedidos em produção</p>
          <h1 className="text-xl font-bold">Novo pedido</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <OrderForm onSave={createProductionOrder} />
      </div>
    </div>
  )
}
