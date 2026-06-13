'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Package, ShoppingCart, PackageOpen,
  DollarSign, BarChart2, LogOut, Archive,
  Notebook, Sparkles, Gift, Flower2, ChevronDown, ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navTop = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/estoque', label: 'Estoque', icon: Archive },
  { href: '/vendas', label: 'Vendas', icon: ShoppingCart },
]

const produtosSubNav = [
  { href: '/produtos/papelaria', label: 'Papelaria', icon: Notebook },
  { href: '/produtos/personalizados', label: 'Personalizados', icon: Sparkles },
  { href: '/produtos/cestas', label: 'Cestas', icon: Gift },
  { href: '/produtos/bbw', label: 'BBW', icon: Flower2 },
]

const navBottom = [
  { href: '/entradas', label: 'Produtos Momentier', icon: PackageOpen },
  { href: '/financeiro', label: 'Financeiro', icon: DollarSign },
  { href: '/relatorios', label: 'Relatórios', icon: BarChart2 },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [produtosOpen, setProdutosOpen] = useState(false)

  useEffect(() => {
    if (pathname.startsWith('/produtos')) setProdutosOpen(true)
  }, [pathname])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  function NavItem({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
    const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
    return (
      <Link
        href={href}
        prefetch={true}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          active
            ? 'bg-brand-red/10 text-brand-red'
            : 'text-brand-brown hover:bg-brand-cream'
        )}
      >
        <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
        {label}
      </Link>
    )
  }

  const produtosActive = pathname.startsWith('/produtos')

  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-56 bg-white border-r border-border z-40">
      <div className="px-5 h-14 flex items-center border-b border-border shrink-0">
        <span className="text-base font-bold text-brand-red tracking-tight">Momentier Atelier</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navTop.map(item => <NavItem key={item.href} {...item} />)}

        {/* Produtos — expansível */}
        <div>
          <button
            onClick={() => setProdutosOpen(v => !v)}
            className={cn(
              'flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              produtosActive
                ? 'bg-brand-red/10 text-brand-red'
                : 'text-brand-brown hover:bg-brand-cream'
            )}
          >
            <span className="flex items-center gap-3">
              <Package size={18} strokeWidth={produtosActive ? 2.5 : 1.5} />
              Produtos
            </span>
            {produtosOpen
              ? <ChevronUp size={14} className="shrink-0 opacity-60" />
              : <ChevronDown size={14} className="shrink-0 opacity-60" />
            }
          </button>

          {produtosOpen && (
            <div className="mt-0.5 pl-5 space-y-0.5">
              {produtosSubNav.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    prefetch={true}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      active
                        ? 'bg-brand-red/10 text-brand-red'
                        : 'text-brand-brown hover:bg-brand-cream'
                    )}
                  >
                    <Icon size={15} strokeWidth={active ? 2.5 : 1.5} />
                    {label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {navBottom.map(item => <NavItem key={item.href} {...item} />)}
      </nav>

      <div className="px-3 py-4 border-t border-border shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-brand-brown hover:bg-brand-cream transition-colors"
        >
          <LogOut size={18} strokeWidth={1.5} />
          Sair
        </button>
      </div>
    </aside>
  )
}
