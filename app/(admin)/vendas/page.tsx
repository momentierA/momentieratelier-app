import Link from 'next/link'
import { getSales } from '@/actions/sales'
import { buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VendasTable } from './VendasTable'

export default async function VendasPage() {
  const sales = await getSales()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Vendas</h1>
        <Link href="/vendas/nova" className={cn(buttonVariants({ size: 'sm' }), 'bg-brand-red hover:bg-brand-red-dark text-white shrink-0')}>
          <Plus size={14} className="mr-1" />Nova
        </Link>
      </div>

      <VendasTable sales={sales} />
    </div>
  )
}
