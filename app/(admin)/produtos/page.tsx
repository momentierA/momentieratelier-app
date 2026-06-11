import Link from 'next/link'
import { getProducts } from '@/actions/products'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { ToggleActiveButton } from './ToggleActiveButton'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

function usd(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
}

export default async function ProdutosPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Produtos</h1>
        <Link href="/produtos/novo" className={cn(buttonVariants({ size: 'sm' }), 'bg-brand-red hover:bg-brand-red-dark text-white shrink-0')}>
          <Plus size={14} className="mr-1" />Novo
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary text-muted-foreground text-xs uppercase">
                <th className="px-4 py-3 text-left">Produto</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-right">Estoque</th>
                <th className="px-4 py-3 text-right">Custo</th>
                <th className="px-4 py-3 text-right">Venda</th>
                <th className="px-4 py-3 text-right">Lucro %</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              )}
              {products.map((p) => {
                const margin = p.sale_price > 0
                  ? ((p.sale_price - p.cost_price) / p.sale_price * 100).toFixed(1)
                  : '0.0'
                const lowStock = p.stock_quantity <= p.low_stock_threshold
                return (
                  <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{p.sku}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={lowStock ? 'text-destructive font-semibold' : ''}>
                        {p.stock_quantity}
                      </span>
                      {lowStock && <span className="text-destructive ml-1 text-xs">⚠</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{usd(p.cost_price)}</td>
                    <td className="px-4 py-3 text-right font-medium">{usd(p.sale_price)}</td>
                    <td className="px-4 py-3 text-right text-brand-brown">{margin}%</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={p.active ? 'default' : 'secondary'} className={p.active ? 'bg-brand-red' : ''}>
                        {p.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/produtos/${p.id}/editar`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
                          Editar
                        </Link>
                        <ToggleActiveButton id={p.id} active={p.active} />
                      </div>
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
