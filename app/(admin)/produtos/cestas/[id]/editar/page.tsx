import { notFound } from 'next/navigation'
import { Pencil } from 'lucide-react'
import { getCestasById, createCestas, updateCestas } from '@/actions/cestas'
import { ProductLineForm } from '@/components/shared/ProductLineForm'

export default async function EditarCestaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getCestasById(id).catch(() => null)
  if (!item) notFound()

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-brand-red p-5 text-white flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
          <Pencil size={22} />
        </div>
        <div>
          <p className="text-xs text-white/60 uppercase tracking-wider">Cestas</p>
          <h1 className="text-xl font-bold">Editar cesta</h1>
          <p className="text-sm text-white/70 mt-0.5 truncate">{item.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <ProductLineForm defaultValues={item} itemId={id} basePath="/produtos/cestas" onSave={createCestas} onUpdate={updateCestas} />
      </div>
    </div>
  )
}
