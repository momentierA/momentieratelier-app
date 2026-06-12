import Link from 'next/link'
import { getProducts } from '@/actions/products'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { ToggleActiveButton } from './ToggleActiveButton'
import { Plus, Pencil } from 'lucide-react'
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

        {/* Mobile: cards */}
        <div className="lg:hidden divide-y divide-border">
          {products.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhum produto cadastrado.</p>
          )}
          {products.map((p) => {
            const margin = p.sale_price > 0
              ? ((p.sale_price - p.cost_price) / p.sale_price * 100).toFixed(1)
              : '0.0'
            const lowStock = p.stock_quantity <= p.low_stock_threshold
            return (
              <div key={p.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm truncate">{p.name}</p>
                    <Badge variant={p.active ? 'default' : 'secondary'} className={cn('text-[10px] shrink-0', p.active ? 'bg-brand-red' : '')}>
                      {p.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                    {p.category && (
                      <Badge variant="outline" className="text-[10px] shrink-0 text-brand-brown border-brand-brown/30">
                        {p.category}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{p.sku}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className={lowStock ? 'text-destructive font-semibold' : ''}>
                      {lowStock && '⚠ '}Estoque: {p.stock_quantity}
                    </span>
                    <span className="text-brand-brown font-medium">{margin}% margem</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="font-bold text-sm">{usd(p.sale_price)}</p>
                  <div className="flex items-center gap-1.5">
                    <Link href={`/produtos/${p.id}/editar`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'h-7 px-2')}>
                      <Pencil size={12} />
                    </Link>
                    <ToggleActiveButton id={p.id} active={p.active} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop: tabela */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary text-muted-foreground text-xs uppercase">
                <th className="px-4 py-3 text-left">Produto</th>
                <th className="px-2 py-3 text-left w-16">SKU</th>
                <th className="px-3 py-3 text-left w-28">Categoria</th>
                <th className="px-3 py-3 text-left w-32">Fornecedor</th>
                <th className="px-3 py-3 text-right w-20 whitespace-nowrap">Estoque</th>
                <th className="px-3 py-3 text-right w-24 whitespace-nowrap">Custo</th>
                <th className="px-3 py-3 text-right w-24 whitespace-nowrap">Venda</th>
                <th className="px-3 py-3 text-right w-20 whitespace-nowrap">Margem</th>
                <th className="px-3 py-3 text-center w-20">Status</th>
                <th className="px-3 py-3 w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
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
                    <td className="px-2 py-3 text-muted-foreground font-mono text-xs">{p.sku}</td>
                    <td className="px-3 py-3 text-muted-foreground text-xs">{p.category ?? '—'}</td>
                    <td className="px-3 py-3 text-muted-foreground text-xs">{p.supplier ?? '—'}</td>
                    <td className="px-3 py-3 text-right">
                      <span className={lowStock ? 'text-destructive font-semibold' : ''}>{p.stock_quantity}</span>
                      {lowStock && <span className="text-destructive ml-1 text-xs">⚠</span>}
                    </td>
                    <td className="px-3 py-3 text-right text-muted-foreground">{usd(p.cost_price)}</td>
                    <td className="px-3 py-3 text-right font-medium">{usd(p.sale_price)}</td>
                    <td className="px-3 py-3 text-right text-brand-brown">{margin}%</td>
                    <td className="px-3 py-3 text-center">
                      <Badge variant={p.active ? 'default' : 'secondary'} className={p.active ? 'bg-brand-red' : ''}>
                        {p.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-1 items-stretch">
                        <Link href={`/produtos/${p.id}/editar`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'h-7 text-xs px-2 justify-center')}>
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
