'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { ProductionOrderSchema, type ProductionOrderFormValues } from '@/schemas/productionOrder'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2 } from 'lucide-react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectGroup, SelectLabel,
} from '@/components/ui/select'

const deliveryLabel: Record<string, string> = { entrega: 'Sim, entrega', nao: 'Não', pickup: 'Pick up' }
const sourceLabel: Record<string, string> = { etsy: 'Etsy', instagram: 'Instagram', facebook: 'Facebook', whatsapp: 'WhatsApp' }
const paymentLabel: Record<string, string> = { dinheiro: 'Dinheiro', pix: 'PIX', cartão: 'Cartão', outro: 'Outro' }
const persColorLabel: Record<string, string> = {
  dourado_matte: 'Dourado Matte',
  dourado_metalico: 'Dourado Metálico',
  pink: 'Pink',
  branco: 'Branco',
  azul_matte: 'Azul Matte',
  preto: 'Preto',
}

function SelectDisplay({ value, map, placeholder }: { value: string | null | undefined; map: Record<string, string>; placeholder: string }) {
  return (
    <span className={value ? 'truncate text-sm' : 'truncate text-sm text-muted-foreground'}>
      {value ? (map[value] ?? value) : placeholder}
    </span>
  )
}

const emptyItem = () => ({
  quantity: 1,
  product_name: '',
  product_color: null,
  personalization: false,
  personalization_color: null,
  custom_name: null,
  font: null,
  design: null,
  unit_price: 0,
})

interface Props {
  defaultValues?: Partial<ProductionOrderFormValues>
  orderId?: string
  onSave: (values: ProductionOrderFormValues) => Promise<{ error?: string; success?: boolean }>
}

export function OrderForm({ defaultValues, orderId, onSave }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const today = new Date().toISOString().split('T')[0]

  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<ProductionOrderFormValues>({
    resolver: zodResolver(ProductionOrderSchema),
    defaultValues: {
      customer_name: '',
      customer_phone: null,
      customer_email: null,
      customer_birthday: null,
      order_number: null,
      order_date: today,
      delivery_date: null,
      delivery_type: 'pickup',
      order_source: null,
      total_amount: 0,
      payment1_amount: null,
      payment1_date: null,
      payment1_method: null,
      payment2_amount: null,
      payment2_date: null,
      payment2_method: null,
      notes: null,
      items: [],
      ...defaultValues,
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const w = watch()

  const usd = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
  const pagoTotal = (w.payment1_amount ?? 0) + (w.payment2_amount ?? 0)
  const restante = (w.total_amount ?? 0) - pagoTotal

  function onSubmit(values: ProductionOrderFormValues) {
    startTransition(async () => {
      const r = await onSave(values)
      if (r.error) { alert(r.error); return }
      router.push('/pedidos')
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* CLIENTE */}
      <div>
        <h2 className="text-sm font-semibold text-brand-brown uppercase tracking-wider mb-3">Cliente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input {...register('customer_name')} placeholder="Nome do cliente" />
            {errors.customer_name && <p className="text-destructive text-xs">{errors.customer_name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input {...register('customer_phone')} placeholder="(00) 00000-0000" />
          </div>
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input {...register('customer_email')} type="email" placeholder="email@exemplo.com" />
          </div>
          <div className="space-y-2">
            <Label>Aniversário</Label>
            <Input {...register('customer_birthday')} type="date" />
          </div>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* PEDIDO */}
      <div>
        <h2 className="text-sm font-semibold text-brand-brown uppercase tracking-wider mb-3">Pedido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Nº do pedido</Label>
            <Input {...register('order_number')} placeholder="Ex: #1042" />
          </div>
          <div className="space-y-2">
            <Label>Data do pedido *</Label>
            <Input {...register('order_date')} type="date" />
            {errors.order_date && <p className="text-destructive text-xs">{errors.order_date.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Data de entrega</Label>
            <Input {...register('delivery_date')} type="date" />
          </div>
          <div className="space-y-2">
            <Label>Entrega *</Label>
            <Select
              defaultValue={defaultValues?.delivery_type ?? 'pickup'}
              onValueChange={(v) => setValue('delivery_type', v as ProductionOrderFormValues['delivery_type'])}
            >
              <SelectTrigger className="w-full">
                <SelectDisplay value={w.delivery_type} map={deliveryLabel} placeholder="Selecionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrega">Sim, entrega</SelectItem>
                <SelectItem value="pickup">Pick up</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Plataforma</Label>
            <Select
              defaultValue={defaultValues?.order_source ?? undefined}
              onValueChange={(v) => setValue('order_source', v as ProductionOrderFormValues['order_source'])}
            >
              <SelectTrigger className="w-full">
                <SelectDisplay value={w.order_source} map={sourceLabel} placeholder="Selecionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="etsy">Etsy</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* PRODUTOS DO PEDIDO */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-brand-brown uppercase tracking-wider">Produtos do pedido</h2>
          <Button type="button" variant="outline" size="sm" onClick={() => append(emptyItem())}>
            <Plus size={14} className="mr-1" /> Adicionar produto
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-lg">
            Nenhum produto adicionado ainda.
          </p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => {
            const item = w.items?.[index]
            return (
              <div key={field.id} className="border border-border rounded-lg p-4 space-y-4 bg-secondary/20">
                {/* Linha 1: produto, qtd, valor, delete */}
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-1 min-w-0">
                    <Label className="text-xs text-muted-foreground">Produto *</Label>
                    <Input {...register(`items.${index}.product_name`)} placeholder="Ex: Copo Stanley, Caneca..." />
                  </div>
                  <div className="w-20 shrink-0 space-y-1">
                    <Label className="text-xs text-muted-foreground">Qtd</Label>
                    <Input type="number" min={1} {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
                  </div>
                  <div className="w-28 shrink-0 space-y-1">
                    <Label className="text-xs text-muted-foreground">Valor unit. ($)</Label>
                    <Input type="number" step="0.01" min={0} {...register(`items.${index}.unit_price`, { valueAsNumber: true })} />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mb-0.5 p-1.5 text-muted-foreground hover:text-destructive rounded transition-colors shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Cor do produto */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Cor do produto</Label>
                  <Input {...register(`items.${index}.product_color`)} placeholder="Ex: Rosa, Preto, Inox..." />
                </div>

                {/* Personalização */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`pers-${index}`}
                    className="w-4 h-4 accent-brand-red cursor-pointer"
                    {...register(`items.${index}.personalization`)}
                  />
                  <label htmlFor={`pers-${index}`} className="text-sm font-medium cursor-pointer select-none">
                    Personalização
                  </label>
                </div>

                {/* Campos de personalização — só aparece quando marcado */}
                {item?.personalization && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-6 border-l-2 border-brand-red/20">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Cor da personalização</Label>
                      <Select
                        defaultValue={defaultValues?.items?.[index]?.personalization_color ?? undefined}
                        onValueChange={(v) => setValue(`items.${index}.personalization_color`, v as ProductionOrderFormValues['items'][0]['personalization_color'])}
                      >
                        <SelectTrigger className="w-full">
                          <SelectDisplay value={item?.personalization_color} map={persColorLabel} placeholder="Selecionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dourado_matte">Dourado Matte</SelectItem>
                          <SelectItem value="dourado_metalico">Dourado Metálico</SelectItem>
                          <SelectItem value="pink">Pink</SelectItem>
                          <SelectItem value="branco">Branco</SelectItem>
                          <SelectItem value="azul_matte">Azul Matte</SelectItem>
                          <SelectItem value="preto">Preto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Nome personalizado</Label>
                      <Input {...register(`items.${index}.custom_name`)} placeholder="Nome a gravar..." />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Fonte</Label>
                      <Select
                        defaultValue={defaultValues?.items?.[index]?.font ?? undefined}
                        onValueChange={(v) => setValue(`items.${index}.font`, v as 'A' | 'B' | 'C' | 'D')}
                      >
                        <SelectTrigger className="w-full">
                          <SelectDisplay value={item?.font} map={{ A: 'Fonte A', B: 'Fonte B', C: 'Fonte C', D: 'Fonte D' }} placeholder="Selecionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">Fonte A</SelectItem>
                          <SelectItem value="B">Fonte B</SelectItem>
                          <SelectItem value="C">Fonte C</SelectItem>
                          <SelectItem value="D">Fonte D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Design</Label>
                      <Select
                        defaultValue={defaultValues?.items?.[index]?.design ?? undefined}
                        onValueChange={(v) => setValue(`items.${index}.design`, v as '01' | '02' | '03' | '04')}
                      >
                        <SelectTrigger className="w-full">
                          <SelectDisplay value={item?.design} map={{ '01': 'Design 01', '02': 'Design 02', '03': 'Design 03', '04': 'Design 04' }} placeholder="Selecionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="01">Design 01</SelectItem>
                          <SelectItem value="02">Design 02</SelectItem>
                          <SelectItem value="03">Design 03</SelectItem>
                          <SelectItem value="04">Design 04</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* FINANCEIRO */}
      <div>
        <h2 className="text-sm font-semibold text-brand-brown uppercase tracking-wider mb-3">Financeiro</h2>

        <div className="space-y-2 mb-4">
          <Label>Valor total do pedido *</Label>
          <div className="relative max-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input type="number" step="0.01" min={0} className="pl-6" {...register('total_amount', { valueAsNumber: true })} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1° Pagamento */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">1° Pagamento</p>
            <div className="space-y-2">
              <Label className="text-xs">Valor ($)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input type="number" step="0.01" min={0} className="pl-6" {...register('payment1_amount', { valueAsNumber: true, setValueAs: v => v === '' || isNaN(v) ? null : v })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Data</Label>
              <Input type="date" {...register('payment1_date')} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Forma de pagamento</Label>
              <Select
                defaultValue={defaultValues?.payment1_method ?? undefined}
                onValueChange={(v) => setValue('payment1_method', v as ProductionOrderFormValues['payment1_method'])}
              >
                <SelectTrigger className="w-full">
                  <SelectDisplay value={w.payment1_method} map={paymentLabel} placeholder="Selecionar..." />
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

          {/* 2° Pagamento */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">2° Pagamento</p>
            <div className="space-y-2">
              <Label className="text-xs">Valor ($)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input type="number" step="0.01" min={0} className="pl-6" {...register('payment2_amount', { valueAsNumber: true, setValueAs: v => v === '' || isNaN(v) ? null : v })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Data</Label>
              <Input type="date" {...register('payment2_date')} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Forma de pagamento</Label>
              <Select
                defaultValue={defaultValues?.payment2_method ?? undefined}
                onValueChange={(v) => setValue('payment2_method', v as ProductionOrderFormValues['payment2_method'])}
              >
                <SelectTrigger className="w-full">
                  <SelectDisplay value={w.payment2_method} map={paymentLabel} placeholder="Selecionar..." />
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
        </div>

        {w.total_amount > 0 && (
          <div className="mt-4 flex flex-wrap gap-4 text-sm p-3 bg-secondary/50 rounded-lg">
            <span>Total: <strong>{usd(w.total_amount)}</strong></span>
            <span className="text-green-600">Pago: <strong>{usd(pagoTotal)}</strong></span>
            <span className={restante > 0 ? 'text-amber-600' : 'text-green-600'}>
              Restante: <strong>{usd(restante)}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-border" />

      <div className="space-y-2">
        <Label>Observações</Label>
        <Textarea {...register('notes')} placeholder="Detalhes do pedido, personalizações, etc..." rows={3} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={pending} className="bg-brand-red hover:bg-brand-red-dark text-white">
          {pending ? 'Salvando...' : orderId ? 'Salvar alterações' : 'Criar pedido'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/pedidos')}>Cancelar</Button>
      </div>
    </form>
  )
}
