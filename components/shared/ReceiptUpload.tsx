'use client'

import { useState, useRef } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface ReceiptUploadProps {
  value?: string | null
  onChange: (url: string | null) => void
  bucket?: 'receipts' | 'products'
  label?: string
}

export function ReceiptUpload({
  value,
  onChange,
  bucket = 'receipts',
  label = 'Comprovante',
}: ReceiptUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setError(null)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file)
    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
  }

  function handleRemove() {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  if (value) {
    return (
      <div className="flex items-center gap-2 p-2 border border-border rounded-lg bg-secondary text-sm">
        <FileText size={16} className="text-brand-brown shrink-0" />
        <a href={value} target="_blank" rel="noreferrer" className="flex-1 truncate text-brand-red hover:underline">
          Ver arquivo
        </a>
        <button type="button" onClick={handleRemove} className="text-muted-foreground hover:text-destructive">
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-brand-red hover:text-brand-red transition-colors w-full justify-center',
          uploading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Upload size={16} />
        {uploading ? 'Enviando...' : `Anexar ${label}`}
      </button>
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  )
}
