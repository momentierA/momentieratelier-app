'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { buttonVariants } from '@/components/ui/button'
import { ToggleActiveButton } from './ToggleActiveButton'
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/supabase/types'

function usd(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
}

const SALES_TAX_RATE = 0.08
const INCOME_TAX_RATE = 0.30

type SortField = 'name' | 'stock' | 'sale_price' | 'margin' | 'net_profit'
type SortDir = 'asc' | 'desc'

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown size={12} className="opacity-30 shrink-0" />
  return dir === 'asc' ? <ChevronUp size={12} className="shrink-0" /> : <ChevronDown size={12} className="shrink-0" />
}

export function ProdutosTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category).filter(Boolean) as string[])).sort(),
    [products]
  )

  const filtered = useMemo(() => {
    let r = products

    if (query.trim()) {
      const q = query.toLowerCase()
      r = r.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    }
    if (statusFilter !== 'all') r = r.filter(p => statusFilter === 'active' ? p.active : !p.active)
    if (categoryFilter !== 'all') r = r.filter(p => p.category === categoryFilter)

    return [...r].sort((a, b) => {
      let va: string | number, vb: string | number
      if (sortField === 'name') { va = a.name; vb = b.name }
      else if (sortField === 'stock') { va = a.stock_quantity; vb = b.stock_quantity }
      else if (sortField === 'sale_price') { va = a.sale_price; vb = b.sale_price }
      else if (sortField === 'margin') {
        va = a.sale_price > 0 ? (a.sale_price - a.cost_price) / a.sale_price : 0
        vb = b.sale_price > 0 ? (b.sale_price - b.cost_price) / b.sale_price : 0
      } else {
        va = Math.max(0, (a.sale_price - a.cost_price) * (1 - INCOME_TAX_RATE))
        vb = Math.max(0, (b.sale_price - b.cost_price) * (1 - INCOME_TAX_RATE))
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [products, query, statusFilter, categoryFilter, sortField, sortDir])

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const SortTh = ({ field, label, className }: { field: SortField; label: string; className?: string }) => (
    <th
      className={cn('py-3 text-muted-foreground text-xs uppercase cursor-pointer select-none whitespace-nowrap', className)}
      onClick={() => toggleSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        <SortIcon active={sortField === field} dir={sortDir} />
      </span>
    </th>
  )

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      {/* Barra de busca e filtros */}
      <div className="px-4 py-3 border-b border-border flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por nome ou SKU..."
            className="pl-8 h-8 text-sm"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? 'all')}>
          <SelectTrigger className="h-8 text-sm w-[170px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
          <SelectTrigger className="h-8 text-sm w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Mobile: cards */}
      <div className="lg:hidden divide-y divide-border">
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhum produto encontrado.</p>
        )}
        {filtered.map((p) => {
          const margin = p.sale_price > 0 ? ((p.sale_price - p.cost_price) / p.sale_price * 100).toFixed(1) : '0.0'
          const lowStock = p.stock_quantity <= p.low_stock_threshold
          const salesTax = p.sale_price * SALES_TAX_RATE
          const grossProfit = p.sale_price - p.cost_price
          const incomeTax = Math.max(0, grossProfit * INCOME_TAX_RATE)
          const netProfit = grossProfit - incomeTax
          return (
            <div key={p.id} className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm truncate">{p.name}</p>
                  <Badge variant={p.active ? 'default' : 'secondary'} className={cn('text-[10px] shrink-0', p.active ? 'bg-brand-red' : '')}>
                    {p.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                  {p.category && (
                    <Badge variant="outline" className="text-[10px] shrink-0 text-brand-brown border-brand-brown/30">{p.category}</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{p.sku}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                  <span className={lowStock ? 'text-destructive font-semibold' : ''}>{lowStock && '⚠ '}Estoque: {p.stock_quantity}</span>
                  <span className="text-brand-brown font-medium">{margin}% margem</span>
                  <span className="text-amber-600">Tax: {usd(salesTax + incomeTax)}</span>
                  <span className="text-emerald-700 font-medium">Líq: {usd(netProfit)}</span>
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
            <tr className="border-b border-border bg-secondary">
              <SortTh field="name" label="Produto" className="px-4 text-left" />
              <th className="px-2 py-3 text-left w-16 text-muted-foreground text-xs uppercase whitespace-nowrap">SKU</th>
              <th className="px-3 py-3 text-left w-28 text-muted-foreground text-xs uppercase whitespace-nowrap">Categoria</th>
              <th className="px-3 py-3 text-left w-32 text-muted-foreground text-xs uppercase whitespace-nowrap">Fornecedor</th>
              <SortTh field="stock" label="Estoque" className="px-3 text-right w-20 justify-end" />
              <th className="px-3 py-3 text-right w-24 text-muted-foreground text-xs uppercase whitespace-nowrap">Custo</th>
              <SortTh field="sale_price" label="Venda" className="px-3 text-right w-24 justify-end" />
              <SortTh field="margin" label="Margem" className="px-3 text-right w-20 justify-end" />
              <th className="px-3 py-3 text-right w-24 text-muted-foreground text-xs uppercase whitespace-nowrap">Sales Tax</th>
              <th className="px-3 py-3 text-right w-28 text-muted-foreground text-xs uppercase whitespace-nowrap">Income Tax</th>
              <SortTh field="net_profit" label="Lucro Líq." className="px-3 text-right w-24 justify-end" />
              <th className="px-3 py-3 text-center w-20 text-muted-foreground text-xs uppercase whitespace-nowrap">Status</th>
              <th className="px-3 py-3 w-16" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr><td colSpan={13} className="px-4 py-8 text-center text-muted-foreground">Nenhum produto encontrado.</td></tr>
            )}
            {filtered.map((p) => {
              const margin = p.sale_price > 0 ? ((p.sale_price - p.cost_price) / p.sale_price * 100).toFixed(1) : '0.0'
              const lowStock = p.stock_quantity <= p.low_stock_threshold
              const salesTax = p.sale_price * SALES_TAX_RATE
              const grossProfit = p.sale_price - p.cost_price
              const incomeTax = Math.max(0, grossProfit * INCOME_TAX_RATE)
              const netProfit = grossProfit - incomeTax
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
                  <td className="px-3 py-3 text-right text-amber-600 font-medium">{usd(salesTax)}</td>
                  <td className="px-3 py-3 text-right text-amber-600 font-medium">{usd(incomeTax)}</td>
                  <td className="px-3 py-3 text-right font-semibold text-emerald-700">{usd(netProfit)}</td>
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
  )
}
