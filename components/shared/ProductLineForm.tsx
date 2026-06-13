'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { ProductLineSchema, type ProductLineFormValues } from '@/schemas/productLine'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ReceiptUpload } from '@/components/shared/ReceiptUpload'
import type { ProductLineItem } from '@/lib/supabase/types'

interface Props {
  defaultValues?: Partial<ProductLineItem>
  itemId?: string
  basePath: string
  onSave: (values: ProductLineFormValues) => Promise<{ error?: string; success?: boolean }>
  onUpdate: (id: string, values: ProductLineFormValues) => Promise<{ error?: string; success?: boolean }>
}

export function ProductLineForm({ defaultValues, itemId, basePath, onSave, onUpdate }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductLineFormValues>({
    resolver: zodResolver(ProductLineSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? null,
      cost_price: defaultValues?.cost_price ?? 0,
      sale_price: defaultValues?.sale_price ?? 0,
      stock_quantity: defaultValues?.stock_quantity ?? 0,
      low_stock_threshold: defaultValues?.low_stock_threshold ?? 5,
      image_url: defaultValues?.image_url ?? null as string | null,
      active: defaultValues?.active ?? true,
    },
  })

  const imageUrl = watch('image_url')

  function onSubmit(values: ProductLineFormValues) {
    startTransition(async () => {
      const result = itemId ? await onUpdate(itemId, values) : await onSave(values)
      if (result.error) {
        alert(result.error)
        return
      }
      router.push(basePath)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label>Nome *</Label>
        <Input {...register('name')} placeholder="Nome do produto" />
        {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Descrição</Label>
        <Input {...register('description')} placeholder="Descrição opcional" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Preço de custo ($)</Label>
          <Input type="number" step="0.01" min={0} {...register('cost_price', { valueAsNumber: true })} />
          {errors.cost_price && <p className="text-destructive text-xs">{errors.cost_price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Preço de venda ($)</Label>
          <Input type="number" step="0.01" min={0} {...register('sale_price', { valueAsNumber: true })} />
          {errors.sale_price && <p className="text-destructive text-xs">{errors.sale_price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Estoque inicial</Label>
          <Input type="number" min={0} {...register('stock_quantity', { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>Alerta estoque baixo</Label>
          <Input type="number" min={0} {...register('low_stock_threshold', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Foto</Label>
        <ReceiptUpload
          bucket="products"
          label="foto"
          value={imageUrl ?? null}
          onChange={(url) => setValue('image_url', url)}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending} className="bg-brand-red hover:bg-brand-red-dark text-white">
          {pending ? 'Salvando...' : itemId ? 'Salvar alterações' : 'Criar'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(basePath)}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
