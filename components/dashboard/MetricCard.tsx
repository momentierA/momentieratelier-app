import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  icon: LucideIcon
  description?: string
  highlight?: boolean
}

export function MetricCard({ title, value, icon: Icon, description, highlight }: MetricCardProps) {
  return (
    <Card className={cn('border-border', highlight && 'border-brand-red/30 bg-brand-red/5')}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className={cn('text-2xl font-bold', highlight ? 'text-brand-red' : 'text-foreground')}>
              {value}
            </p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          <div className={cn(
            'p-2.5 rounded-lg',
            highlight ? 'bg-brand-red/10 text-brand-red' : 'bg-secondary text-brand-brown'
          )}>
            <Icon size={20} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
