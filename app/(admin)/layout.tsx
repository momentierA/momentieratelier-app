import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/layout/BottomNav'
import { Sidebar } from '@/components/layout/Sidebar'
import { RefreshButton } from '@/components/layout/RefreshButton'
import { APP_VERSION } from '@/lib/version'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <>
      <Sidebar />

      {/* conteúdo principal — desloca para a direita no desktop */}
      <div className="lg:pl-56">
        <header
          className="sticky top-0 z-50 bg-white border-b border-border"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="px-4 h-12 flex items-center justify-between">
            {/* título visível só no mobile (desktop tem a sidebar) */}
            <span className="text-base font-bold text-brand-red tracking-tight lg:hidden">
              Momentier Atelier
            </span>
            {/* spacer no desktop para manter o refresh alinhado à direita */}
            <span className="hidden lg:block" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-brand-brown/70 font-mono font-bold">{APP_VERSION}</span>
              <RefreshButton />
            </div>
          </div>
        </header>

        <main
          className="px-4 py-4 max-w-2xl mx-auto lg:mx-0 lg:max-w-6xl"
          style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}
        >
          {children}
        </main>
      </div>

      {/* nav mobile — oculta no desktop */}
      <BottomNav />
    </>
  )
}
