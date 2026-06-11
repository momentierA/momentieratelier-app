import { notFound } from 'next/navigation'
import { getProductById } from '@/actions/products'
import { ProductForm } from '../../ProductForm'

export default async function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id).catch(() => null)
  if (!product) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar produto</h1>
      <ProductForm defaultValues={product} productId={id} />
    </div>
  )
}
