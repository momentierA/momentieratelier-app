import Link from 'next/link'
import { Notebook, Sparkles, Gift, Flower2 } from 'lucide-react'

const lines = [
  { href: '/produtos/papelaria', label: 'Papelaria', description: 'Itens de papelaria e escritório', icon: Notebook, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { href: '/produtos/personalizados', label: 'Personalizados', description: 'Produtos personalizados sob encomenda', icon: Sparkles, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { href: '/produtos/cestas', label: 'Cestas', description: 'Cestas e kits montados', icon: Gift, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { href: '/produtos/bbw', label: 'BBW', description: 'Bath & Body Works', icon: Flower2, color: 'bg-pink-50 text-pink-700 border-pink-200' },
]

export default function ProdutosLandingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Produtos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {lines.map(({ href, label, description, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-xl border border-border bg-white p-5 hover:shadow-md transition-all"
          >
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="font-semibold group-hover:text-brand-red transition-colors">{label}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
