import Link from 'next/link'
import { getProducts } from '@/actions/products'
import { buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProdutosTable } from './ProdutosTable'

export default async function EstoquePage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Estoque</h1>
        <Link href="/estoque/novo" className={cn(buttonVariants({ size: 'sm' }), 'bg-brand-red hover:bg-brand-red-dark text-white shrink-0')}>
          <Plus size={14} className="mr-1" />Novo
        </Link>
      </div>

      <ProdutosTable products={products} />
    </div>
  )
}
