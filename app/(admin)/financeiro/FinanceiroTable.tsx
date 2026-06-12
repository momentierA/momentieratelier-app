'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, FileText } from 'lucide-react'
import type { Expense } from '@/lib/supabase/types'

function usd(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
}

function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR')
}

const categoryLabel: Record<string, string> = {
  shipping: 'Shipping', taxas: 'Taxas', operacional: 'Operacional', outros: 'Outros',
}

const categoryColor: Record<string, string> = {
  shipping: 'bg-blue-100 text-blue-800',
  taxas: 'bg-amber-100 text-amber-800',
  operacional: 'bg-purple-100 text-purple-800',
  outros: 'bg-gray-100 text-gray-800',
}

type SortField = 'date' | 'amount'
type SortDir = 'asc' | 'desc'

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown size={12} className="opacity-30 shrink-0" />
  return dir === 'asc' ? <ChevronUp size={12} className="shrink-0" /> : <ChevronDown size={12} className="shrink-0" />
}

export function FinanceiroTable({ expenses }: { expenses: Expense[] }) {
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const filtered = useMemo(() => {
    let r = expenses

    if (query.trim()) {
      const q = query.toLowerCase()
      r = r.filter(e => e.description.toLowerCase().includes(q))
    }
    if (categoryFilter !== 'all') r = r.filter(e => e.category === categoryFilter)

    return [...r].sort((a, b) => {
      const va = sortField === 'date' ? a.expense_date : a.amount
      const vb = sortField === 'date' ? b.expense_date : b.amount
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [expenses, query, categoryFilter, sortField, sortDir])

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const filteredTotal = filtered.reduce((acc, e) => acc + e.amount, 0)

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      {/* Barra de busca e filtros */}
      <div className="px-4 py-3 border-b border-border flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por descrição..."
            className="pl-8 h-8 text-sm"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? 'all')}>
          <SelectTrigger className="h-8 text-sm w-[160px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            <SelectItem value="shipping">Shipping</SelectItem>
            <SelectItem value="taxas">Taxas</SelectItem>
            <SelectItem value="operacional">Operacional</SelectItem>
            <SelectItem value="outros">Outros</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Mobile: cards */}
      <div className="lg:hidden divide-y divide-border">
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhuma despesa encontrada.</p>
        )}
        {filtered.map((e) => (
          <div key={e.id} className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">{e.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{fmtDate(e.expense_date)}</span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${categoryColor[e.category]}`}>
                  {categoryLabel[e.category]}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-sm">{usd(e.amount)}</span>
              {e.receipt_url && (
                <a href={e.receipt_url} target="_blank" rel="noreferrer" className="text-brand-red">
                  <FileText size={14} />
                </a>
              )}
            </div>
          </div>
        ))}
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
              <th className="px-4 py-3 text-left">Descrição</th>
              <th className="px-4 py-3 text-left w-32 whitespace-nowrap">Categoria</th>
              <th
                className="px-4 py-3 text-right w-28 whitespace-nowrap cursor-pointer select-none"
                onClick={() => toggleSort('amount')}
              >
                <span className="flex items-center justify-end gap-1">Valor <SortIcon active={sortField === 'amount'} dir={sortDir} /></span>
              </th>
              <th className="px-4 py-3 text-center w-16 whitespace-nowrap">Recibo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Nenhuma despesa encontrada.</td></tr>
            )}
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">{fmtDate(e.expense_date)}</td>
                <td className="px-4 py-3 font-medium">{e.description}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor[e.category]}`}>
                    {categoryLabel[e.category]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold">{usd(e.amount)}</td>
                <td className="px-4 py-3 text-center">
                  {e.receipt_url
                    ? <a href={e.receipt_url} target="_blank" rel="noreferrer" className="text-brand-red hover:underline inline-flex items-center gap-1"><FileText size={14} /></a>
                    : '—'
                  }
                </td>
              </tr>
            ))}
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
