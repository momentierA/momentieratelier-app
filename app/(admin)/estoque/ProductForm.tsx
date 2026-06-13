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
      kit_quantity: defaultValues?.kit_quantity ?? null,
    },
  })

  const imageUrl = watch('image_url')
  const costPrice = watch('cost_price') || 0
  const salePrice = watch('sale_price') || 0

  const MARKUP_MIN = 3
  const MARKUP_MAX = 4.5
  const SALES_TAX_RATE = 0.08
  const INCOME_TAX_RATE = 0.30

  const suggestedMin = costPrice * MARKUP_MIN
  const suggestedMax = costPrice * MARKUP_MAX
  const salesTax = salePrice * SALES_TAX_RATE
  const grossProfit = salePrice - costPrice
  const incomeTax = Math.max(0, grossProfit * INCOME_TAX_RATE)
  const netProfit = grossProfit - incomeTax

  const priceStatus = costPrice > 0 && salePrice > 0
    ? salePrice < suggestedMin ? 'below' : salePrice > suggestedMax ? 'above' : 'within'
    : null

  function usd(v: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
  }

  function onSubmit(values: ProductFormValues) {
    startTransition(async () => {
      const result = productId
        ? await updateProduct(productId, values)
        : await createProduct(values)

      if (result.error) {
        alert(result.error)
        return
      }
      router.push('/estoque')
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

      {/* Linha 1: SKU · Estoque · Alerta · Kit */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

        <div className="space-y-2">
          <Label>Alerta estoque baixo</Label>
          <Input type="number" min={0} {...register('low_stock_threshold', { valueAsNumber: true })} />
        </div>

        <div className="space-y-2">
          <Label>Qtd. no kit</Label>
          <Input type="number" min={1} {...register('kit_quantity', { valueAsNumber: true, setValueAs: v => v === '' ? null : Number(v) })} placeholder="1" />
          <p className="text-xs text-muted-foreground">Unidades por embalagem</p>
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

      {/* Calculadora de Preço */}
      {costPrice > 0 && (
        <div className="rounded-lg border border-border bg-secondary/40 p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Calculadora de Preço</p>

          {/* Faixa sugerida */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Faixa sugerida (3× – 4.5×)</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{usd(suggestedMin)} – {usd(suggestedMax)}</span>
              {priceStatus === 'below' && <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">Abaixo da faixa</span>}
              {priceStatus === 'within' && <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">Na faixa ✓</span>}
              {priceStatus === 'above' && <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">Acima da faixa</span>}
            </div>
          </div>

          {/* Breakdown só quando preço de venda está preenchido */}
          {salePrice > 0 && (
            <div className="border-t border-border pt-3 space-y-2">
              <p className="text-xs text-muted-foreground">Com venda a {usd(salePrice)}:</p>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lucro bruto</span>
                <span>{usd(grossProfit)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sales tax (8% do preço de venda)</span>
                <span className="font-medium text-amber-700">– {usd(salesTax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Income tax (30% do lucro bruto)</span>
                <span className="font-medium text-amber-700">– {usd(incomeTax)}</span>
              </div>

              <div className="flex justify-between text-sm font-semibold border-t border-border pt-2 mt-1">
                <span>Lucro líquido</span>
                <span className={netProfit >= 0 ? 'text-emerald-700' : 'text-destructive'}>{usd(netProfit)}</span>
              </div>

              <p className="text-[11px] text-muted-foreground pt-1">
                Separar: <span className="font-medium text-amber-700">{usd(salesTax + incomeTax)}</span>
                {' '}({usd(salesTax)} sales tax + {usd(incomeTax)} income tax)
              </p>
            </div>
          )}
        </div>
      )}

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
        <Button type="button" variant="outline" onClick={() => router.push('/estoque')}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
