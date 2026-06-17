import Link from 'next/link'
import { getMomentierProducts, toggleMomentierProductActive } from '@/actions/momentier'
import { buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductLineTable } from '@/components/shared/ProductLineTable'

export default async function ProdutosMomentierPage() {
  const items = await getMomentierProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Produtos Momentier</h1>
        <Link href="/entradas/nova" className={cn(buttonVariants({ size: 'sm' }), 'bg-brand-red hover:bg-brand-red-dark text-white shrink-0')}>
          <Plus size={14} className="mr-1" />Novo
        </Link>
      </div>

      <ProductLineTable items={items} basePath="/entradas" toggleActive={toggleMomentierProductActive} />
    </div>
  )
}
