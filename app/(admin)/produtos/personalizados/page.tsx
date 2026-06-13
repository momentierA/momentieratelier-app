import Link from 'next/link'
import { getPersonalizados, togglePersonalizadosActive } from '@/actions/personalizados'
import { buttonVariants } from '@/components/ui/button'
import { Plus, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductLineTable } from '@/components/shared/ProductLineTable'

export default async function PersonalizadosPage() {
  const items = await getPersonalizados()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link href="/produtos" className="text-muted-foreground hover:text-brand-red transition-colors">
            <ChevronLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold">Personalizados</h1>
        </div>
        <Link href="/produtos/personalizados/novo" className={cn(buttonVariants({ size: 'sm' }), 'bg-brand-red hover:bg-brand-red-dark text-white shrink-0')}>
          <Plus size={14} className="mr-1" />Novo
        </Link>
      </div>

      <ProductLineTable items={items} basePath="/produtos/personalizados" toggleActive={togglePersonalizadosActive} />
    </div>
  )
}
