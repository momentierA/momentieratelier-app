'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { ProductSchema, type ProductFormValues } from '@/schemas/product'
import { createProduct, updateProduct } from '@/actions/products'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ReceiptUpload } from '@/components/shared/ReceiptUpload'
import type { Product } from '@/lib/supabase/types'

interface ProductFormProps {
  defaultValues?: Partial<Product>
  productId?: string
}

export function ProductForm({ defaultValues, productId }: ProductFormProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      sku: defaultValues?.sku ?? '',
      image_url: defaultValues?.image_url ?? null,
      stock_quantity: defaultValues?.stock_quantity ?? 0,
      cost_price: defaultValues?.cost_price ?? 0,
      sale_price: defaultValues?.sale_price ?? 0,
      low_stock_threshold: defaultValues?.low_stock_threshold ?? 5,
      active: defaultValues?.active ?? true,
      category: defaultValues?.category ?? null,
      supplier: defaultValues?.supplier ?? null,
      supplier_link: defaultValues?.supplier_link ?? null,
    },
  })

  const imageUrl = watch('image_url')

  function onSubmit(values: ProductFormValues) {
    startTransition(async () => {
      const result = productId
        ? await updateProduct(productId, values)
        : await createProduct(values)

      if (result.error) {
        alert(result.error)
        return
      }
      router.push('/produtos')
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Nome — sempre largura total */}
      <div className="space-y-2">
        <Label>Nome *</Label>
        <Input {...register('name')} placeholder="Nome do produto" />
        {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
      </div>

      {/* Linha 1: SKU · Estoque · Alerta */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>SKU *</Label>
          <Input {...register('sku')} placeholder="EX-001" className="font-mono" />
          {errors.sku && <p className="text-destructive text-xs">{errors.sku.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Estoque inicial</Label>
          <Input type="number" min={0} {...register('stock_quantity', { valueAsNumber: true })} />
          {errors.stock_quantity && <p className="text-destructive text-xs">{errors.stock_quantity.message}</p>}
        </div>

        <div className="col-span-2 lg:col-span-1 space-y-2">
          <Label>Alerta de estoque baixo</Label>
          <Input type="number" min={0} {...register('low_stock_threshold', { valueAsNumber: true })} />
          <p className="text-xs text-muted-foreground">Avisa quando atingir este valor</p>
        </div>
      </div>

      {/* Linha 2: Custo · Venda · Categoria */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Preço de custo ($) *</Label>
          <Input type="number" step="0.01" min={0} {...register('cost_price', { valueAsNumber: true })} />
          {errors.cost_price && <p className="text-destructive text-xs">{errors.cost_price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Preço de venda ($) *</Label>
          <Input type="number" step="0.01" min={0} {...register('sale_price', { valueAsNumber: true })} />
          {errors.sale_price && <p className="text-destructive text-xs">{errors.sale_price.message}</p>}
        </div>

        <div className="col-span-2 lg:col-span-1 space-y-2">
          <Label>Categoria</Label>
          <Input {...register('category')} placeholder="Ex: Vela, Fita, Chocolate..." />
        </div>
      </div>

      {/* Linha 3: Fornecedor · Link */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fornecedor</Label>
          <Input {...register('supplier')} placeholder="Ex: Bath & Body Works, Shein..." />
        </div>

        <div className="space-y-2">
          <Label>Link do fornecedor</Label>
          <Input {...register('supplier_link')} placeholder="URL ou código do produto" />
        </div>
      </div>

      {/* Foto */}
      <div className="space-y-2">
        <Label>Foto do produto</Label>
        <ReceiptUpload
          bucket="products"
          label="foto"
          value={imageUrl}
          onChange={(url) => setValue('image_url', url)}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={pending}
          className="bg-brand-red hover:bg-brand-red-dark text-white"
        >
          {pending ? 'Salvando...' : productId ? 'Salvar alterações' : 'Criar produto'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/produtos')}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
