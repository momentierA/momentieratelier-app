'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingCart, PackageOpen,
  DollarSign, BarChart2
} from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/', icon: LayoutDashboard, label: 'Início' },
  { href: '/produtos', icon: Package, label: 'Produtos' },
  { href: '/vendas', icon: ShoppingCart, label: 'Vendas' },
  { href: '/entradas', icon: PackageOpen, label: 'Entradas' },
  { href: '/financeiro', icon: DollarSign, label: 'Finanças' },
  { href: '/relatorios', icon: BarChart2, label: 'Rel.' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[80] bg-white border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 py-2.5 flex-1 transition-colors',
                active ? 'text-brand-red' : 'text-brand-brown'
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[11px] font-medium leading-none">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
