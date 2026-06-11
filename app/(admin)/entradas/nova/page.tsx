import { getActiveProducts } from '@/actions/products'
import { PurchaseForm } from '../PurchaseForm'

export default async function NovaEntradaPage() {
  const products = await getActiveProducts()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Registrar entrada de estoque</h1>
      <PurchaseForm products={products} />
    </div>
  )
}
