import Link from 'next/link'
import { ClipboardList, Plus } from 'lucide-react'
import { getProductionOrders } from '@/actions/productionOrders'
import { OrdersTable } from './OrdersTable'

export default async function PedidosPage() {
  const orders = await getProductionOrders()

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-brand-red p-5 text-white flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <ClipboardList size={22} />
          </div>
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wider">Gestão</p>
            <h1 className="text-xl font-bold">Pedidos em produção</h1>
          </div>
        </div>
        <Link href="/pedidos/novo" className="flex items-center gap-1 bg-white text-brand-red hover:bg-white/90 font-medium text-sm px-4 py-2 rounded-lg shrink-0 transition-colors">
          <Plus size={16} /> Novo pedido
        </Link>
      </div>

      <OrdersTable orders={orders} />
    </div>
  )
}
