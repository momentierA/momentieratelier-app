import { Sparkles } from 'lucide-react'
import { ProductLineForm } from '@/components/shared/ProductLineForm'
import { createPersonalizados, updatePersonalizados } from '@/actions/personalizados'

export default function NovoPersonalizadoPage() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-brand-red p-5 text-white flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <Sparkles size={22} />
        </div>
        <div>
          <p className="text-xs text-white/60 uppercase tracking-wider">Personalizados</p>
          <h1 className="text-xl font-bold">Novo item</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <ProductLineForm basePath="/produtos/personalizados" onSave={createPersonalizados} onUpdate={updatePersonalizados} />
      </div>
    </div>
  )
}
