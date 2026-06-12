import Link from 'next/link'
import { getExpenses } from '@/actions/expenses'
import { buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FinanceiroTable } from './FinanceiroTable'

function usd(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
}

const categoryLabel: Record<string, string> = {
  insumos: 'Insumos', shipping: 'Shipping', taxas: 'Taxas', operacional: 'Operacional', outros: 'Outros',
}

export default async function FinanceiroPage() {
  const expenses = await getExpenses()

  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthTotal = expenses.filter(e => e.expense_date.startsWith(thisMonth)).reduce((acc, e) => acc + e.amount, 0)

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

      <FinanceiroTable expenses={expenses} />
    </div>
  )
}
