'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Pencil, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import type { ProductionOrder } from '@/lib/supabase/types'

const usd = (v: number | null) =>
  v != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v) : '—'

const fmtDate = (d: string | null) =>
  d ? new Date(d + 'T12:00:00').toLocaleDateString('pt-BR') : '—'

const sourceLabel: Record<string, string> = {
  etsy: 'Etsy', instagram: 'Instagram', facebook: 'Facebook', whatsapp: 'WhatsApp',
}
const deliveryLabel: Record<string, string> = {
  entrega: 'Entrega', nao: 'Não', pickup: 'Pick up',
}
const deliveryColor: Record<string, string> = {
  entrega: 'bg-blue-100 text-blue-700',
  nao: 'bg-secondary text-muted-foreground',
  pickup: 'bg-amber-100 text-amber-700',
}
const sourceColor: Record<string, string> = {
  etsy: 'bg-orange-100 text-orange-700',
  instagram: 'bg-pink-100 text-pink-700',
  facebook: 'bg-blue-100 text-blue-700',
  whatsapp: 'bg-green-100 text-green-700',
}

type SortField = 'delivery_date' | 'order_date' | 'total_amount' | 'customer_name'
type SortDir = 'asc' | 'desc'

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown size={12} className="opacity-30 shrink-0" />
  return dir === 'asc' ? <ChevronUp size={12} className="shrink-0" /> : <ChevronDown size={12} className="shrink-0" />
}

function pago(o: ProductionOrder) {
  return (o.payment1_amount ?? 0) + (o.payment2_amount ?? 0)
}

export function OrdersTable({ orders }: { orders: ProductionOrder[] }) {
  const [query, setQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('delivery_date')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const filtered = useMemo(() => {
    let r = orders
    if (query.trim()) {
      const q = query.toLowerCase()
      r = r.filter(o =>
        o.customer_name.toLowerCase().includes(q) ||
        (o.order_number ?? '').toLowerCase().includes(q) ||
        (o.customer_phone ?? '').includes(q)
      )
    }
    return [...r].sort((a, b) => {
      const va = a[sortField] ?? ''
      const vb = b[sortField] ?? ''
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [orders, query, sortField, sortDir])

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por cliente, nº pedido ou telefone..."
            className="pl-8 h-8 text-sm"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{filtered.length} pedido{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Mobile */}
      <div className="lg:hidden divide-y divide-border">
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhum pedido encontrado.</p>
        )}
        {filtered.map(o => {
          const pagoVal = pago(o)
          const restante = o.total_amount - pagoVal
          return (
            <div key={o.id} className="px-4 py-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">{o.customer_name}</p>
                  {o.order_number && <p className="text-xs text-muted-foreground">Pedido {o.order_number}</p>}
                </div>
                <Link href={`/pedidos/${o.id}/editar`} className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground shrink-0">
                  <Pencil size={15} />
                </Link>
              </div>
              <div className="flex flex-wrap gap-1 text-xs">
                {o.order_source && <span className={`px-1.5 py-0.5 rounded ${sourceColor[o.order_source]}`}>{sourceLabel[o.order_source]}</span>}
                <span className={`px-1.5 py-0.5 rounded ${deliveryColor[o.delivery_type]}`}>{deliveryLabel[o.delivery_type] ?? o.delivery_type}</span>
                {o.delivery_date && <span className="px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">Entrega: {fmtDate(o.delivery_date)}</span>}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Total: <strong>{usd(o.total_amount)}</strong></span>
                <span className={restante > 0 ? 'text-amber-600 font-medium' : 'text-green-600 font-medium'}>
                  {restante > 0 ? `Restante: ${usd(restante)}` : 'Pago ✓'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary text-muted-foreground text-xs uppercase">
              <th className="px-4 py-3 text-left cursor-pointer select-none" onClick={() => toggleSort('customer_name')}>
                <span className="flex items-center gap-1">Cliente <SortIcon active={sortField === 'customer_name'} dir={sortDir} /></span>
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Contato</th>
              <th className="px-4 py-3 text-left whitespace-nowrap cursor-pointer select-none" onClick={() => toggleSort('order_date')}>
                <span className="flex items-center gap-1">Pedido <SortIcon active={sortField === 'order_date'} dir={sortDir} /></span>
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap cursor-pointer select-none" onClick={() => toggleSort('delivery_date')}>
                <span className="flex items-center gap-1">Entrega <SortIcon active={sortField === 'delivery_date'} dir={sortDir} /></span>
              </th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Tipo</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Plataforma</th>
              <th className="px-4 py-3 text-right whitespace-nowrap cursor-pointer select-none" onClick={() => toggleSort('total_amount')}>
                <span className="flex items-center justify-end gap-1">Total <SortIcon active={sortField === 'total_amount'} dir={sortDir} /></span>
              </th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Pago</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Restante</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">Nenhum pedido encontrado.</td></tr>
            )}
            {filtered.map(o => {
              const pagoVal = pago(o)
              const restante = o.total_amount - pagoVal
              return (
                <tr key={o.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{o.customer_name}</p>
                    {o.order_number && <p className="text-xs text-muted-foreground">#{o.order_number}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {o.customer_phone && <p>{o.customer_phone}</p>}
                    {o.customer_email && <p className="truncate max-w-[160px]">{o.customer_email}</p>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{fmtDate(o.order_date)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{fmtDate(o.delivery_date)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${deliveryColor[o.delivery_type]}`}>
                      {deliveryLabel[o.delivery_type] ?? o.delivery_type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {o.order_source && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sourceColor[o.order_source]}`}>
                        {sourceLabel[o.order_source]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{usd(o.total_amount)}</td>
                  <td className="px-4 py-3 text-right text-green-600">{pagoVal > 0 ? usd(pagoVal) : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    {restante > 0
                      ? <span className="text-amber-600 font-medium">{usd(restante)}</span>
                      : <Badge variant="secondary" className="text-green-600">Pago ✓</Badge>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/pedidos/${o.id}/editar`} className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground inline-flex">
                      <Pencil size={15} />
                    </Link>
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
