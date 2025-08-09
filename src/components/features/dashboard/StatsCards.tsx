import { FileText, Clock, MessageSquare, Upload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatCardData {
  title: string
  value: string
  description: string
  icon: LucideIcon
}

interface StatsCardsProps {
  className?: string
}

const defaultStats: StatCardData[] = [
  {
    title: 'Total Documents',
    value: '24',
    description: '+2 from last week',
    icon: FileText,
  },
  {
    title: 'Processing',
    value: '3',
    description: 'Currently processing',
    icon: Clock,
  },
  {
    title: 'Chat Sessions',
    value: '156',
    description: '+12% from last month',
    icon: MessageSquare,
  },
  {
    title: 'Storage Used',
    value: '2.4 GB',
    description: 'of 10 GB limit',
    icon: Upload,
  },
]

export function StatsCards({ className }: StatsCardsProps) {
  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className || ''}`}>
      {defaultStats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="backdrop-blur-sm bg-background/95">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
