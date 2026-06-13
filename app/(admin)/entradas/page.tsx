import Link from 'next/link'
import { getPurchases } from '@/actions/purchases'
import { buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EntradasTable } from './EntradasTable'

export default async function EntradasPage() {
  const purchases = await getPurchases()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Produtos Momentier</h1>
        <Link href="/entradas/nova" className={cn(buttonVariants({ size: 'sm' }), 'bg-brand-red hover:bg-brand-red-dark text-white shrink-0')}>
          <Plus size={14} className="mr-1" />Nova
        </Link>
      </div>

      <EntradasTable purchases={purchases} />
    </div>
  )
}
