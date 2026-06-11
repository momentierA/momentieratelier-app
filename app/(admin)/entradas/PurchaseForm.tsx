'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { PurchaseSchema, type PurchaseFormValues } from '@/schemas/purchase'
import { createPurchase } from '@/actions/purchases'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ReceiptUpload } from '@/components/shared/ReceiptUpload'
import { Trash2, Plus } from 'lucide-react'

interface Props {
  products: { id: string; name: string; sku: string; cost_price: number }[]
}

export function PurchaseForm({ products }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const today = new Date().toISOString().split('T')[0]

  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<PurchaseFormValues>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: {
      supplier: '',
      notes: '',
      purchase_date: today,
      receipt_url: null,
      items: [{ product_id: '', quantity: 1, unit_cost: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  function onProductChange(index: number, productId: string) {
    const product = products.find(p => p.id === productId)
    if (product) {
      setValue(`items.${index}.product_id`, productId)
      setValue(`items.${index}.unit_cost`, product.cost_price)
    }
  }

  function onSubmit(values: PurchaseFormValues) {
    startTransition(async () => {
      const result = await createPurchase(values)
      if (result.error) { alert(result.error); return }
      router.push('/entradas')
    })
  }

  const items = watch('items')
  const total = items.reduce((acc, i) => acc + (i.quantity || 0) * (i.unit_cost || 0), 0)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data *</Label>
          <Input type="date" {...register('purchase_date')} />
          {errors.purchase_date && <p className="text-destructive text-xs">{errors.purchase_date.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Fornecedor</Label>
          <Input {...register('supplier')} placeholder="Nome do fornecedor" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Produtos *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ product_id: '', quantity: 1, unit_cost: 0 })}
          >
            <Plus size={14} className="mr-1" /> Adicionar
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-[1fr_80px_100px_36px] gap-2 items-end">
            <div className="space-y-1">
              {index === 0 && <Label className="text-xs text-muted-foreground">Produto</Label>}
              <Select onValueChange={(v) => onProductChange(index, v as string)}>
                <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register(`items.${index}.product_id`)} />
            </div>
            <div className="space-y-1">
              {index === 0 && <Label className="text-xs text-muted-foreground">Qtd</Label>}
              <Input type="number" min={1} {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              {index === 0 && <Label className="text-xs text-muted-foreground">Custo unit. ($)</Label>}
              <Input type="number" step="0.01" min={0} {...register(`items.${index}.unit_cost`, { valueAsNumber: true })} />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
        {errors.items && <p className="text-destructive text-xs">{errors.items.message ?? errors.items.root?.message}</p>}
        <div className="text-right text-sm font-semibold text-brand-red">
          Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Notas</Label>
        <Textarea {...register('notes')} placeholder="Observações opcionais..." rows={2} />
      </div>

      <div className="space-y-2">
        <Label>Comprovante / Invoice</Label>
        <ReceiptUpload value={watch('receipt_url')} onChange={(url) => setValue('receipt_url', url)} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={pending} className="bg-brand-red hover:bg-brand-red-dark text-white">
          {pending ? 'Salvando...' : 'Registrar entrada'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/entradas')}>Cancelar</Button>
      </div>
    </form>
  )
}
