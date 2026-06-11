import Link from 'next/link'
import { getPurchases } from '@/actions/purchases'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

function usd(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
}

export default async function EntradasPage() {
  const purchases = await getPurchases()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Entradas</h1>
        <Link href="/entradas/nova" className={cn(buttonVariants({ size: 'sm' }), 'bg-brand-red hover:bg-brand-red-dark text-white shrink-0')}>
          <Plus size={14} className="mr-1" />Nova
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary text-muted-foreground text-xs uppercase">
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left">Fornecedor</th>
                <th className="px-4 py-3 text-left">Produtos</th>
                <th className="px-4 py-3 text-right">Total pago</th>
                <th className="px-4 py-3 text-left">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {purchases.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhuma entrada registrada.
                  </td>
                </tr>
              )}
              {purchases.map((p) => {
                const total = p.purchase_items.reduce((acc, i) => acc + i.quantity * i.unit_cost, 0)
                return (
                  <tr key={p.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(p.purchase_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">{p.supplier ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.purchase_items.map((i) => (
                          <Badge key={i.id} variant="secondary" className="text-xs">
                            {i.products.name} ×{i.quantity}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{usd(total)}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate">
                      {p.notes ?? '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
