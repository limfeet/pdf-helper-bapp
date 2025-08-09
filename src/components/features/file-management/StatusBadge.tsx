import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'processed' | 'processing' | 'failed'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    processed: { icon: CheckCircle, color: 'bg-green-500', text: 'Processed' },
    processing: { icon: Loader2, color: 'bg-yellow-500', text: 'Processing' },
    failed: { icon: AlertCircle, color: 'bg-red-500', text: 'Failed' },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <Icon className={cn('h-3 w-3', status === 'processing' && 'animate-spin')} />
      {config.text}
    </Badge>
  )
}
