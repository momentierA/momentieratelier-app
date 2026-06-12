'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import type { PurchaseWithItems } from '@/lib/supabase/types'

function usd(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
}

function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR')
}

type SortField = 'date' | 'total'
type SortDir = 'asc' | 'desc'

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown size={12} className="opacity-30 shrink-0" />
  return dir === 'asc' ? <ChevronUp size={12} className="shrink-0" /> : <ChevronDown size={12} className="shrink-0" />
}

export function EntradasTable({ purchases }: { purchases: PurchaseWithItems[] }) {
  const [query, setQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const filtered = useMemo(() => {
    let r = purchases

    if (query.trim()) {
      const q = query.toLowerCase()
      r = r.filter(p =>
        (p.supplier ?? '').toLowerCase().includes(q) ||
        p.purchase_items.some(i => i.products.name.toLowerCase().includes(q)) ||
        (p.notes ?? '').toLowerCase().includes(q)
      )
    }

    return [...r].sort((a, b) => {
      const totalA = a.purchase_items.reduce((acc, i) => acc + i.quantity * i.unit_cost, 0)
      const totalB = b.purchase_items.reduce((acc, i) => acc + i.quantity * i.unit_cost, 0)
      const va = sortField === 'date' ? a.purchase_date : totalA
      const vb = sortField === 'date' ? b.purchase_date : totalB
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [purchases, query, sortField, sortDir])

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const filteredTotal = filtered.reduce((acc, p) =>
    acc + p.purchase_items.reduce((a, i) => a + i.quantity * i.unit_cost, 0), 0)

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      {/* Barra de busca */}
      <div className="px-4 py-3 border-b border-border flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por fornecedor ou produto..."
            className="pl-8 h-8 text-sm"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Mobile: cards */}
      <div className="lg:hidden divide-y divide-border">
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhuma entrada encontrada.</p>
        )}
        {filtered.map((p) => {
          const total = p.purchase_items.reduce((acc, i) => acc + i.quantity * i.unit_cost, 0)
          return (
            <div key={p.id} className="px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">{fmtDate(p.purchase_date)}</span>
                  {p.supplier && <span className="text-xs text-muted-foreground"> · {p.supplier}</span>}
                </div>
                <span className="font-bold text-sm">{usd(total)}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {p.purchase_items.map(i => (
                  <Badge key={i.id} variant="secondary" className="text-xs">{i.products.name} ×{i.quantity}</Badge>
                ))}
              </div>
              {p.notes && <p className="text-xs text-muted-foreground truncate">{p.notes}</p>}
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
              <th className="px-4 py-3 text-left w-36 whitespace-nowrap">Fornecedor</th>
              <th className="px-4 py-3 text-left">Produtos</th>
              <th
                className="px-4 py-3 text-right w-28 whitespace-nowrap cursor-pointer select-none"
                onClick={() => toggleSort('total')}
              >
                <span className="flex items-center justify-end gap-1">Total pago <SortIcon active={sortField === 'total'} dir={sortDir} /></span>
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Notas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Nenhuma entrada encontrada.</td></tr>
            )}
            {filtered.map((p) => {
              const total = p.purchase_items.reduce((acc, i) => acc + i.quantity * i.unit_cost, 0)
              return (
                <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">{fmtDate(p.purchase_date)}</td>
                  <td className="px-4 py-3">{p.supplier ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.purchase_items.map(i => (
                        <Badge key={i.id} variant="secondary" className="text-xs">{i.products.name} ×{i.quantity}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{usd(total)}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate">{p.notes ?? '—'}</td>
                </tr>
              )
            })}
          </tbody>
          {filtered.length > 0 && (
            <tfoot>
              <tr className="border-t border-border bg-secondary/50">
                <td colSpan={3} className="px-4 py-2 text-xs text-muted-foreground">Total filtrado</td>
                <td className="px-4 py-2 text-right font-bold text-brand-red">{usd(filteredTotal)}</td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
