import { createClient } from '@/lib/supabase/server'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle } from 'lucide-react'

function usd(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

  const [salesRes, expensesRes, productsRes] = await Promise.all([
    supabase
      .from('sales')
      .select('sale_items(quantity, unit_price)')
      .gte('sale_date', startOfMonth),
    supabase
      .from('expenses')
      .select('amount')
      .gte('expense_date', startOfMonth),
    supabase
      .from('products')
      .select('id, name, sku, stock_quantity, low_stock_threshold, sale_price, cost_price')
      .eq('active', true),
  ])

  type SaleRow = { sale_items: { quantity: number; unit_price: number; product_id: string }[] }
  const salesData = (salesRes.data ?? []) as unknown as SaleRow[]

  const salesThisMonth = salesData.reduce((acc, sale) => {
    return acc + sale.sale_items.reduce((s, i) => s + i.quantity * i.unit_price, 0)
  }, 0)

  const expensesThisMonth = (expensesRes.data ?? []).reduce((acc, e) => acc + e.amount, 0)

  const products = productsRes.data ?? []
  const lowStockProducts = products.filter(p => p.stock_quantity <= p.low_stock_threshold)

  const costOfSales = salesData.reduce((acc, sale) => {
    return acc + sale.sale_items.reduce((s, i) => {
      const product = products.find(p => p.id === i.product_id)
      return s + i.quantity * (product?.cost_price ?? 0)
    }, 0)
  }, 0)

  const grossProfit = salesThisMonth - costOfSales
  const netBalance = grossProfit - expensesThisMonth

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Vendas do mês"
          value={usd(salesThisMonth)}
          icon={TrendingUp}
          highlight
        />
        <MetricCard
          title="Despesas do mês"
          value={usd(expensesThisMonth)}
          icon={TrendingDown}
        />
        <MetricCard
          title="Lucro estimado"
          value={usd(grossProfit)}
          icon={DollarSign}
          description="Vendas − custo dos produtos"
          highlight={grossProfit > 0}
        />
        <MetricCard
          title="Saldo líquido"
          value={usd(netBalance)}
          icon={DollarSign}
          description="Lucro bruto − despesas"
        />
        <MetricCard
          title="Produtos ativos"
          value={String(products.length)}
          icon={Package}
          description={lowStockProducts.length > 0 ? `${lowStockProducts.length} com estoque baixo` : 'Estoque OK'}
        />
      </div>

      {lowStockProducts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            <h2 className="font-semibold text-foreground">Alerta de estoque baixo</h2>
          </div>
          <div className="bg-white rounded-xl border border-border divide-y divide-border">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.sku}</p>
                </div>
                <Badge variant="destructive" className="text-xs">
                  {p.stock_quantity} restantes
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
