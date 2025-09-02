// src/features/points/PointsNotice.tsx
'use client'
import { Card, CardContent } from '@/components/ui/card'

export default function PointsNotice() {
  return (
    <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
      <CardContent className="py-3 text-sm">
        <div className="font-semibold">Pricing & Policy Information</div>
        <div>• Pricing: 10 pages = 1 point = $1 (no decimals)</div>
        <div>
          • Non-subscribers: Pre-deduction before upload · No refunds (except system failures)
        </div>
        <div>
          • Subscribers: Charged only upon successful conversion (reserved→charged on success)
        </div>
      </CardContent>
    </Card>
  )
}
