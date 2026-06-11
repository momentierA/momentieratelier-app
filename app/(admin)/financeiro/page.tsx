import Link from 'next/link'
import { getExpenses } from '@/actions/expenses'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

function usd(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
}

const categoryLabel: Record<string, string> = {
  shipping: 'Shipping',
  taxas: 'Taxas',
  operacional: 'Operacional',
  outros: 'Outros',
}

const categoryColor: Record<string, string> = {
  shipping: 'bg-blue-100 text-blue-800',
  taxas: 'bg-amber-100 text-amber-800',
  operacional: 'bg-purple-100 text-purple-800',
  outros: 'bg-gray-100 text-gray-800',
}

export default async function FinanceiroPage() {
  const expenses = await getExpenses()

  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthExpenses = expenses.filter(e => e.expense_date.startsWith(thisMonth))
  const monthTotal = monthExpenses.reduce((acc, e) => acc + e.amount, 0)

  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Financeiro</h1>
        <Link href="/financeiro/nova" className={cn(buttonVariants({ size: 'sm' }), 'bg-brand-red hover:bg-brand-red-dark text-white shrink-0')}>
          <Plus size={14} className="mr-1" />Nova despesa
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(categoryLabel).map(([key, label]) => (
          <div key={key} className="bg-white rounded-lg border border-border p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-bold mt-1">{usd(byCategory[key] ?? 0)}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Total este mês</span>
        <span className="font-semibold text-brand-red">{usd(monthTotal)}</span>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary text-muted-foreground text-xs uppercase">
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left">Descrição</th>
                <th className="px-4 py-3 text-left">Categoria</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3 text-center">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhuma despesa registrada.
                  </td>
                </tr>
              )}
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(e.expense_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 font-medium">{e.description}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor[e.category]}`}>
                      {categoryLabel[e.category]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{usd(e.amount)}</td>
                  <td className="px-4 py-3 text-center">
                    {e.receipt_url ? (
                      <a href={e.receipt_url} target="_blank" rel="noreferrer" className="text-brand-red hover:underline inline-flex items-center gap-1">
                        <FileText size={14} />
                      </a>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
