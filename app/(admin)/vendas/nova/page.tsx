import { getActiveProducts } from '@/actions/products'
import { SaleForm } from '../SaleForm'

export default async function NovaVendaPage() {
  const products = await getActiveProducts()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Registrar venda</h1>
      <SaleForm products={products} />
    </div>
  )
}
