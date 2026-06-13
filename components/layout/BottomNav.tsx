'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Archive, DollarSign, MoreHorizontal,
  ShoppingCart, PackageOpen, BarChart2, X, Package
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mainNav = [
  { href: '/', icon: LayoutDashboard, label: 'Início' },
  { href: '/estoque', icon: Archive, label: 'Estoque' },
  { href: '/financeiro', icon: DollarSign, label: 'Finanças' },
]

const moreNav = [
  { href: '/vendas', icon: ShoppingCart, label: 'Vendas' },
  { href: '/produtos', icon: Package, label: 'Produtos' },
  { href: '/entradas', icon: PackageOpen, label: 'Prod. Momentier' },
  { href: '/relatorios', icon: BarChart2, label: 'Relatórios' },
]

export function BottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  const moreActive = moreNav.some(({ href }) => pathname.startsWith(href))

  // fecha ao navegar
  useEffect(() => { setMoreOpen(false) }, [pathname])

  return (
    <>
      {/* overlay — só mobile */}
      {moreOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[70]"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* popup do "Mais" — só mobile */}
      {moreOpen && (
        <div
          className="fixed bottom-[calc(56px+env(safe-area-inset-bottom))] right-2 z-[75] bg-white border border-border rounded-xl shadow-lg overflow-hidden"
          style={{ minWidth: 180 }}
        >
          {moreNav.map(({ href, icon: Icon, label }) => {
            const active = href === '/produtos'
              ? pathname.startsWith('/produtos')
              : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                prefetch={true}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors',
                  active ? 'text-brand-red bg-brand-cream' : 'text-brand-brown hover:bg-brand-cream'
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
                {label}
              </Link>
            )
          })}
        </div>
      )}

      {/* barra principal — oculta no desktop */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[80] bg-white border-t border-border"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center">
          {mainNav.map(({ href, icon: Icon, label }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                prefetch={true}
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

          {/* botão Mais */}
          <button
            onClick={() => setMoreOpen(v => !v)}
            className={cn(
              'flex flex-col items-center gap-0.5 py-2.5 flex-1 transition-colors',
              (moreActive || moreOpen) ? 'text-brand-red' : 'text-brand-brown'
            )}
          >
            {moreOpen
              ? <X size={20} strokeWidth={2} />
              : <MoreHorizontal size={20} strokeWidth={(moreActive || moreOpen) ? 2.5 : 1.5} />
            }
            <span className="text-[11px] font-medium leading-none">Mais</span>
          </button>
        </div>
      </nav>
    </>
  )
}
