import { PackageOpen } from 'lucide-react'
import { ProductLineForm } from '@/components/shared/ProductLineForm'
import { createMomentierProduct, updateMomentierProduct } from '@/actions/momentier'

export default function NovoProdutoMomentierPage() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-brand-red p-5 text-white flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <PackageOpen size={22} />
        </div>
        <div>
          <p className="text-xs text-white/60 uppercase tracking-wider">Produtos Momentier</p>
          <h1 className="text-xl font-bold">Novo produto</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <ProductLineForm basePath="/entradas" onSave={createMomentierProduct} onUpdate={updateMomentierProduct} />
      </div>
    </div>
  )
}
