import { ShoppingCart } from 'lucide-react'
import { getActiveProducts } from '@/actions/products'
import { getMomentierActiveProducts } from '@/actions/momentier'
import { getActivePapelaria } from '@/actions/papelaria'
import { getActivePersonalizados } from '@/actions/personalizados'
import { getActiveCestas } from '@/actions/cestas'
import { getActiveBBW } from '@/actions/bbw'
import { createSale } from '@/actions/sales'
import { SaleForm } from '../SaleForm'

export default async function NovaVendaPage() {
  const [estoqueProducts, momentierProducts, papelariaProducts, personalizadosProducts, cestasProducts, bbwProducts] = await Promise.all([
    getActiveProducts(),
    getMomentierActiveProducts(),
    getActivePapelaria(),
    getActivePersonalizados(),
    getActiveCestas(),
    getActiveBBW(),
  ])

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-brand-red p-5 text-white flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <ShoppingCart size={22} />
        </div>
        <div>
          <p className="text-xs text-white/60 uppercase tracking-wider">Vendas</p>
          <h1 className="text-xl font-bold">Registrar venda</h1>
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
          onSave={createSale}
        />
      </div>
    </div>
  )
}
