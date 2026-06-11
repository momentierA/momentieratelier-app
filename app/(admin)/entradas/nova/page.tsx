import { PackageOpen } from 'lucide-react'
import { getActiveProducts } from '@/actions/products'
import { PurchaseForm } from '../PurchaseForm'

export default async function NovaEntradaPage() {
  const products = await getActiveProducts()

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-brand-red p-5 text-white flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <PackageOpen size={22} />
        </div>
        <div>
          <p className="text-xs text-white/60 uppercase tracking-wider">Entradas</p>
          <h1 className="text-xl font-bold">Nova entrada de estoque</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <PurchaseForm products={products} />
      </div>
    </div>
  )
}
