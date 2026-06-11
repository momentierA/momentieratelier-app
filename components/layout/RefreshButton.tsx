'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RefreshButton() {
  const [spinning, setSpinning] = useState(false)

  function handleRefresh() {
    setSpinning(true)
    setTimeout(() => window.location.reload(), 400)
  }

  return (
    <button
      onClick={handleRefresh}
      className="p-1.5 rounded-md text-brand-brown/60 hover:text-brand-red hover:bg-brand-cream transition-colors"
      aria-label="Atualizar app"
    >
      <RefreshCw size={16} className={cn(spinning && 'animate-spin')} />
    </button>
  )
}
