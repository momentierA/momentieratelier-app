import Link from 'next/link'
import { getBBW, toggleBBWActive } from '@/actions/bbw'
import { copyProductLineItemToMomentier } from '@/actions/momentier'
import { buttonVariants } from '@/components/ui/button'
import { Plus, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductLineTable } from '@/components/shared/ProductLineTable'
import type { ProductLineItem } from '@/lib/supabase/types'

export default async function BBWPage() {
  const items = await getBBW()

  async function handleCopy(item: ProductLineItem) {
    'use server'
    return copyProductLineItemToMomentier(item)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link href="/produtos" className="text-muted-foreground hover:text-brand-red transition-colors">
            <ChevronLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold">BBW</h1>
        </div>
        <Link href="/produtos/bbw/novo" className={cn(buttonVariants({ size: 'sm' }), 'bg-brand-red hover:bg-brand-red-dark text-white shrink-0')}>
          <Plus size={14} className="mr-1" />Novo
        </Link>
      </div>

      <ProductLineTable items={items} basePath="/produtos/bbw" toggleActive={toggleBBWActive} onCopyToMomentier={handleCopy} />
    </div>
  )
}
