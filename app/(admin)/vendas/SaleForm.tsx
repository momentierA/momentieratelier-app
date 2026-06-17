'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { SaleSchema, type SaleFormValues } from '@/schemas/sale'
import { createSale } from '@/actions/sales'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectGroup, SelectLabel } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ReceiptUpload } from '@/components/shared/ReceiptUpload'
import { Trash2, Plus } from 'lucide-react'

interface Props {
  estoqueProducts: { id: string; name: string; sku: string; sale_price: number; stock_quantity?: number }[]
  momentierProducts: { id: string; name: string; sale_price: number }[]
}

export function SaleForm({ estoqueProducts, momentierProducts }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const today = new Date().toISOString().split('T')[0]

  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<SaleFormValues>({
    resolver: zodResolver(SaleSchema),
    defaultValues: {
      sale_date: today,
      payment_method: 'outro',
      order_number: '',
      notes: '',
      receipt_url: null,
      items: [{ product_ref: '', product_name: '', quantity: 1, unit_price: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  function onProductChange(index: number, ref: string) {
    setValue(`items.${index}.product_ref`, ref)

    if (ref.startsWith('e:')) {
      const product = estoqueProducts.find(p => p.id === ref.slice(2))
      if (product) {
        setValue(`items.${index}.product_name`, product.name)
        setValue(`items.${index}.unit_price`, product.sale_price)
      }
    } else if (ref.startsWith('m:')) {
      const product = momentierProducts.find(p => p.id === ref.slice(2))
      if (product) {
        setValue(`items.${index}.product_name`, product.name)
        setValue(`items.${index}.unit_price`, product.sale_price)
      }
    }
  }

  function onSubmit(values: SaleFormValues) {
    startTransition(async () => {
      const result = await createSale(values)
      if (result.error) { alert(result.error); return }
      router.push('/vendas')
    })
  }

  const items = watch('items')
  const paymentMethod = watch('payment_method')
  const total = items.reduce((acc, i) => acc + (i.quantity || 0) * (i.unit_price || 0), 0)
  const usd = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)

  const paymentLabels: Record<string, string> = {
    dinheiro: 'Dinheiro', pix: 'PIX', cartão: 'Cartão', outro: 'Outro',
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Data · Nº pedido · Pagamento */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Data *</Label>
          <Input type="date" {...register('sale_date')} />
          {errors.sale_date && <p className="text-destructive text-xs">{errors.sale_date.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Nº do pedido</Label>
          <Input {...register('order_number')} placeholder="Ex: #1042, ORD-001..." />
        </div>

        <div className="col-span-2 lg:col-span-1 space-y-2">
          <Label>Forma de pagamento *</Label>
          <Select defaultValue="outro" onValueChange={(v) => setValue('payment_method', v as SaleFormValues['payment_method'])}>
            <SelectTrigger>
              <span className="text-sm">{paymentLabels[paymentMethod] ?? 'Outro'}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dinheiro">Dinheiro</SelectItem>
              <SelectItem value="pix">PIX</SelectItem>
              <SelectItem value="cartão">Cartão</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Produtos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Produtos vendidos *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ product_ref: '', product_name: '', quantity: 1, unit_price: 0 })}
          >
            <Plus size={14} className="mr-1" /> Adicionar
          </Button>
        </div>

        {fields.map((field, index) => {
          const qty = items[index]?.quantity || 0
          const price = items[index]?.unit_price || 0
          const subtotal = qty * price
          return (
            <div key={field.id} className="border border-border rounded-lg p-3 space-y-3 bg-secondary/20">
              {/* Linha 1: produto + botão remover */}
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-1 min-w-0">
                  <Label className="text-xs text-muted-foreground">Produto</Label>
                  <Select onValueChange={(v) => onProductChange(index, v as string)}>
                    <SelectTrigger className="w-full">
                      <span className={items[index]?.product_name ? 'truncate text-sm' : 'truncate text-sm text-muted-foreground'}>
                        {items[index]?.product_name || 'Selecionar produto...'}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {estoqueProducts.length > 0 && (
                        <SelectGroup>
                          <SelectLabel>Estoque</SelectLabel>
                          {estoqueProducts.map(p => (
                            <SelectItem key={p.id} value={`e:${p.id}`}>
                              {p.name} <span className="text-muted-foreground">({p.sku})</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                      {momentierProducts.length > 0 && (
                        <SelectGroup>
                          <SelectLabel>Produtos Momentier</SelectLabel>
                          {momentierProducts.map(p => (
                            <SelectItem key={p.id} value={`m:${p.id}`}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...register(`items.${index}.product_ref`)} />
                  <input type="hidden" {...register(`items.${index}.product_name`)} />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              {/* Linha 2: qtd + preço + subtotal */}
              <div className="grid grid-cols-[100px_1fr_auto] gap-3 items-end">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Qtd</Label>
                  <Input type="number" min={1} {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Preço unit. ($)</Label>
                  <Input type="number" step="0.01" min={0} {...register(`items.${index}.unit_price`, { valueAsNumber: true })} />
                </div>
                {subtotal > 0 && (
                  <div className="pb-2 text-sm font-semibold text-brand-brown whitespace-nowrap">
                    = {usd(subtotal)}
                  </div>
                )}
              </div>
            </div>
          )
        })}
        {errors.items && <p className="text-destructive text-xs">{errors.items.message ?? errors.items.root?.message}</p>}

        <div className="text-right text-sm font-semibold text-brand-red">
          Total: {usd(total)}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Notas</Label>
        <Textarea {...register('notes')} placeholder="Observações opcionais..." rows={2} />
      </div>

      <div className="space-y-2">
        <Label>Comprovante</Label>
        <ReceiptUpload value={watch('receipt_url')} onChange={(url) => setValue('receipt_url', url)} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={pending} className="bg-brand-red hover:bg-brand-red-dark text-white">
          {pending ? 'Salvando...' : 'Registrar venda'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/vendas')}>Cancelar</Button>
      </div>
    </form>
  )
}
