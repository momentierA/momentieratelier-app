'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SaleWithItems } from '@/lib/supabase/types'

function usd(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
}

function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR')
}

const paymentLabel: Record<string, string> = {
  dinheiro: 'Dinheiro', pix: 'PIX', cartão: 'Cartão', outro: 'Outro',
}

type SortField = 'date' | 'total'
type SortDir = 'asc' | 'desc'

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown size={12} className="opacity-30 shrink-0" />
  return dir === 'asc' ? <ChevronUp size={12} className="shrink-0" /> : <ChevronDown size={12} className="shrink-0" />
}

function itemLabel(item: SaleWithItems['sale_items'][0]) {
  const name = item.product_name ?? '—'
  return `${name} ×${item.quantity}`
}

export function VendasTable({ sales }: { sales: SaleWithItems[] }) {
  const [query, setQuery] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const filtered = useMemo(() => {
    let r = sales

    if (query.trim()) {
      const q = query.toLowerCase()
      r = r.filter(s =>
        s.sale_items.some(i => (i.product_name ?? '').toLowerCase().includes(q)) ||
        (s.notes ?? '').toLowerCase().includes(q) ||
        (s.order_number ?? '').toLowerCase().includes(q)
      )
    }
    if (paymentFilter !== 'all') r = r.filter(s => s.payment_method === paymentFilter)

    return [...r].sort((a, b) => {
      const totalA = a.sale_items.reduce((acc, i) => acc + i.quantity * i.unit_price, 0)
      const totalB = b.sale_items.reduce((acc, i) => acc + i.quantity * i.unit_price, 0)
      const va = sortField === 'date' ? a.sale_date : totalA
      const vb = sortField === 'date' ? b.sale_date : totalB
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [sales, query, paymentFilter, sortField, sortDir])

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const filteredTotal = filtered.reduce((acc, s) =>
    acc + s.sale_items.reduce((a, i) => a + i.quantity * i.unit_price, 0), 0)

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      {/* Barra de busca e filtros */}
      <div className="px-4 py-3 border-b border-border flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por produto, pedido ou nota..."
            className="pl-8 h-8 text-sm"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <Select value={paymentFilter} onValueChange={(v) => setPaymentFilter(v ?? 'all')}>
          <SelectTrigger className="h-8 text-sm w-[150px]"><SelectValue placeholder="Pagamento" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os pagamentos</SelectItem>
            <SelectItem value="dinheiro">Dinheiro</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
            <SelectItem value="cartão">Cartão</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Mobile: cards */}
      <div className="lg:hidden divide-y divide-border">
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhuma venda encontrada.</p>
        )}
        {filtered.map((s) => {
          const total = s.sale_items.reduce((acc, i) => acc + i.quantity * i.unit_price, 0)
          return (
            <div key={s.id} className="px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{fmtDate(s.sale_date)}</span>
                  {s.order_number && <span className="text-xs font-mono text-brand-brown">{s.order_number}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{paymentLabel[s.payment_method] ?? s.payment_method}</span>
                  <span className="font-bold text-sm">{usd(total)}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {s.sale_items.map(i => (
                  <Badge key={i.id} variant="secondary" className={cn('text-xs', i.momentier_product_id ? 'border-brand-red/30 text-brand-red' : '')}>
                    {itemLabel(i)}
                  </Badge>
                ))}
              </div>
              {s.notes && <p className="text-xs text-muted-foreground truncate">{s.notes}</p>}
            </div>
          )
        })}
      </div>

      {/* Desktop: tabela */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary text-muted-foreground text-xs uppercase">
              <th
                className="px-4 py-3 text-left w-28 whitespace-nowrap cursor-pointer select-none"
                onClick={() => toggleSort('date')}
              >
                <span className="flex items-center gap-1">Data <SortIcon active={sortField === 'date'} dir={sortDir} /></span>
              </th>
              <th className="px-4 py-3 text-left w-32 whitespace-nowrap">Nº Pedido</th>
              <th className="px-4 py-3 text-left">Produtos</th>
              <th
                className="px-4 py-3 text-right w-28 whitespace-nowrap cursor-pointer select-none"
                onClick={() => toggleSort('total')}
              >
                <span className="flex items-center justify-end gap-1">Total <SortIcon active={sortField === 'total'} dir={sortDir} /></span>
              </th>
              <th className="px-4 py-3 text-left w-32 whitespace-nowrap">Pagamento</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Notas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Nenhuma venda encontrada.</td></tr>
            )}
            {filtered.map((s) => {
              const total = s.sale_items.reduce((acc, i) => acc + i.quantity * i.unit_price, 0)
              return (
                <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">{fmtDate(s.sale_date)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-brand-brown">{s.order_number ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.sale_items.map(i => (
                        <Badge
                          key={i.id}
                          variant="secondary"
                          className={cn('text-xs', i.momentier_product_id ? 'border-brand-red/30 text-brand-red' : '')}
                        >
                          {itemLabel(i)}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{usd(total)}</td>
                  <td className="px-4 py-3">{paymentLabel[s.payment_method] ?? s.payment_method}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate">{s.notes ?? '—'}</td>
                </tr>
              )
            })}
          </tbody>
          {filtered.length > 0 && (
            <tfoot>
              <tr className="border-t border-border bg-secondary/50">
                <td colSpan={3} className="px-4 py-2 text-xs text-muted-foreground">Total filtrado</td>
                <td className="px-4 py-2 text-right font-bold text-brand-red">{usd(filteredTotal)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
