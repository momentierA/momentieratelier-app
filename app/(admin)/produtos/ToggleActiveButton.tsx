'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { toggleProductActive } from '@/actions/products'

export function ToggleActiveButton({ id, active }: { id: string; active: boolean }) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(async () => { await toggleProductActive(id, !active) })}
      className="text-muted-foreground"
    >
      {active ? 'Inativar' : 'Ativar'}
    </Button>
  )
}
