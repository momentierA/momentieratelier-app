import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

function usd(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
}

export default async function RelatoriosPage() {
  const supabase = await createClient()

  const [salesRes, expensesRes, productsRes, purchasesRes] = await Promise.all([
    supabase.from('sales').select('sale_date, sale_items(quantity, unit_price, product_id, products(name))'),
    supabase.from('expenses').select('amount, category, expense_date'),
    supabase.from('products').select('id, name, sku, stock_quantity, cost_price, sale_price, active').eq('active', true).order('name'),
    supabase.from('purchases').select('purchase_date, purchase_items(quantity, unit_cost, product_id)'),
  ])

  type SaleRow = { sale_items: { quantity: number; unit_price: number; product_id: string; products: { name: string } | null }[] }
  type PurchaseRow = { purchase_items: { quantity: number; unit_cost: number; product_id: string }[] }

  const sales = (salesRes.data ?? []) as unknown as SaleRow[]
  const expenses = expensesRes.data ?? []
  const products = productsRes.data ?? []
  const purchases = (purchasesRes.data ?? []) as unknown as PurchaseRow[]

  // Vendas por produto
  const salesByProduct: Record<string, { name: string; qty: number; revenue: number }> = {}
  for (const sale of sales) {
    for (const item of sale.sale_items) {
      const name = item.products?.name ?? item.product_id
      if (!salesByProduct[item.product_id]) salesByProduct[item.product_id] = { name, qty: 0, revenue: 0 }
      salesByProduct[item.product_id].qty += item.quantity
      salesByProduct[item.product_id].revenue += item.quantity * item.unit_price
    }
  }
  const topProducts = Object.values(salesByProduct).sort((a, b) => b.revenue - a.revenue)

  // Custo por produto vendido
  const costByProduct: Record<string, number> = {}
  for (const purchase of purchases) {
    for (const item of purchase.purchase_items) {
      costByProduct[item.product_id] = (costByProduct[item.product_id] ?? 0) + item.quantity * item.unit_cost
    }
  }

  // Despesas por mês
  const expensesByMonth: Record<string, number> = {}
  for (const e of expenses) {
    const month = e.expense_date.slice(0, 7)
    expensesByMonth[month] = (expensesByMonth[month] ?? 0) + e.amount
  }
  const sortedMonths = Object.entries(expensesByMonth).sort((a, b) => b[0].localeCompare(a[0]))

  // Despesas por categoria
  const expensesByCategory: Record<string, number> = {}
  for (const e of expenses) {
    expensesByCategory[e.category] = (expensesByCategory[e.category] ?? 0) + e.amount
  }

  const categoryLabel: Record<string, string> = {
    shipping: 'Shipping', taxas: 'Taxas', operacional: 'Operacional', outros: 'Outros',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Relatórios</h1>

      <Tabs defaultValue="produtos">
        <TabsList className="bg-secondary">
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
        </TabsList>

        <TabsContent value="produtos" className="mt-4">
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border font-semibold text-sm">Lucro por produto (mais rentáveis)</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary text-muted-foreground text-xs uppercase">
                  <th className="px-4 py-2 text-left">Produto</th>
                  <th className="px-4 py-2 text-right">Qtd vendida</th>
                  <th className="px-4 py-2 text-right">Receita</th>
                  <th className="px-4 py-2 text-right">Lucro est.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topProducts.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">Sem dados de vendas.</td></tr>
                )}
                {topProducts.map((p) => {
                  const product = products.find(pr => pr.name === p.name)
                  const cost = product ? p.qty * product.cost_price : 0
                  const profit = p.revenue - cost
                  return (
                    <tr key={p.name} className="hover:bg-secondary/30">
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-right">{p.qty}</td>
                      <td className="px-4 py-3 text-right">{usd(p.revenue)}</td>
                      <td className="px-4 py-3 text-right text-brand-brown font-semibold">{usd(profit)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="vendas" className="mt-4">
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border font-semibold text-sm">Produtos mais vendidos</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary text-muted-foreground text-xs uppercase">
                  <th className="px-4 py-2 text-left">Produto</th>
                  <th className="px-4 py-2 text-right">Unidades</th>
                  <th className="px-4 py-2 text-right">Receita total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...topProducts].sort((a, b) => b.qty - a.qty).map((p) => (
                  <tr key={p.name} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-right font-semibold">{p.qty}</td>
                    <td className="px-4 py-3 text-right">{usd(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="despesas" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(categoryLabel).map(([key, label]) => (
              <div key={key} className="bg-white rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-bold mt-1">{usd(expensesByCategory[key] ?? 0)}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border font-semibold text-sm">Despesas por mês</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary text-muted-foreground text-xs uppercase">
                  <th className="px-4 py-2 text-left">Mês</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedMonths.length === 0 && (
                  <tr><td colSpan={2} className="px-4 py-6 text-center text-muted-foreground">Sem despesas.</td></tr>
                )}
                {sortedMonths.map(([month, total]) => (
                  <tr key={month} className="hover:bg-secondary/30">
                    <td className="px-4 py-3">{new Date(month + '-15').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</td>
                    <td className="px-4 py-3 text-right font-semibold">{usd(total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="estoque" className="mt-4">
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border font-semibold text-sm">Estoque atual</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary text-muted-foreground text-xs uppercase">
                  <th className="px-4 py-2 text-left">Produto</th>
                  <th className="px-4 py-2 text-left">SKU</th>
                  <th className="px-4 py-2 text-right">Qtd</th>
                  <th className="px-4 py-2 text-right">Valor em estoque</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.sku}</td>
                    <td className="px-4 py-3 text-right">{p.stock_quantity}</td>
                    <td className="px-4 py-3 text-right">{usd(p.stock_quantity * p.cost_price)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={p.stock_quantity === 0 ? 'destructive' : p.stock_quantity <= 5 ? 'outline' : 'default'}
                        className={p.stock_quantity > 5 ? 'bg-brand-red' : ''}>
                        {p.stock_quantity === 0 ? 'Esgotado' : p.stock_quantity <= 5 ? 'Baixo' : 'OK'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
