'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { ExpenseSchema, type ExpenseFormValues } from '@/schemas/expense'
import { createExpense, updateExpense } from '@/actions/expenses'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ReceiptUpload } from '@/components/shared/ReceiptUpload'
import type { Expense } from '@/lib/supabase/types'

interface ExpenseFormProps {
  defaultValues?: Partial<Expense>
  expenseId?: string
}

export function ExpenseForm({ defaultValues, expenseId }: ExpenseFormProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const today = new Date().toISOString().split('T')[0]

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      description: defaultValues?.description ?? '',
      amount: defaultValues?.amount ?? 0,
      category: defaultValues?.category ?? 'outros',
      expense_date: defaultValues?.expense_date ?? today,
      supplier: defaultValues?.supplier ?? null,
      receipt_url: defaultValues?.receipt_url ?? null,
    },
  })

  function onSubmit(values: ExpenseFormValues) {
    startTransition(async () => {
      const result = expenseId
        ? await updateExpense(expenseId, values)
        : await createExpense(values)
      if (result.error) { alert(result.error); return }
      router.push('/financeiro')
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label>Descrição *</Label>
        <Input {...register('description')} placeholder="Ex: Taxa do marketplace, shipping..." />
        {errors.description && <p className="text-destructive text-xs">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Valor ($) *</Label>
          <Input type="number" step="0.01" min={0} {...register('amount', { valueAsNumber: true })} />
          {errors.amount && <p className="text-destructive text-xs">{errors.amount.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Data *</Label>
          <Input type="date" {...register('expense_date')} />
          {errors.expense_date && <p className="text-destructive text-xs">{errors.expense_date.message}</p>}
        </div>

        <div className="col-span-2 lg:col-span-1 space-y-2">
          <Label>Categoria *</Label>
          <Select defaultValue={defaultValues?.category ?? 'outros'} onValueChange={(v) => setValue('category', v as ExpenseFormValues['category'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="insumos">Insumos</SelectItem>
              <SelectItem value="shipping">Shipping</SelectItem>
              <SelectItem value="taxas">Taxas</SelectItem>
              <SelectItem value="operacional">Operacional</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Fornecedor</Label>
        <Input {...register('supplier')} placeholder="Ex: Amazon, Shein, Hobby Lobby..." />
      </div>

      <div className="space-y-2">
        <Label>Comprovante</Label>
        <ReceiptUpload value={watch('receipt_url')} onChange={(url) => setValue('receipt_url', url)} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending} className="bg-brand-red hover:bg-brand-red-dark text-white">
          {pending ? 'Salvando...' : expenseId ? 'Salvar alterações' : 'Salvar despesa'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/financeiro')}>Cancelar</Button>
      </div>
    </form>
  )
}
