import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/layout/BottomNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-white border-b border-border"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="px-4 h-12 flex items-center">
          <span className="text-base font-bold text-brand-red tracking-tight">
            Momentier Atelier
          </span>
        </div>
      </header>

      <main
        className="px-4 py-4 max-w-2xl mx-auto"
        style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}
      >
        {children}
      </main>

      <BottomNav />
    </>
  )
}
