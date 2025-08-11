'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'

type TwoStepVerificationCardProps = {
  className?: string
  phone?: string
  onEdit?: () => void
  onRemove?: () => void
}

const TwoStepVerificationCard: React.FC<TwoStepVerificationCardProps> = ({
  className,
  phone = '+1(968) 819-2547',
  onEdit,
  onRemove,
}) => {
  return (
    <Card className={`w-full ${className ?? ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Two-step verification</CardTitle>
        <p className="text-sm text-muted-foreground">
          Keep your account secure with authentication step.
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <div className="text-sm font-semibold text-foreground">SMS</div>
          <div className="mt-1 flex items-center justify-between gap-3">
            <div className="text-sm text-foreground">{phone}</div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={onEdit}
                aria-label="Edit phone"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={onRemove}
                aria-label="Remove phone"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <p className="pt-2 text-sm text-muted-foreground">
          Two-factor authentication adds an additional layer of security to your account by
          requiring more than just a password to log in.&nbsp;
          <a href="#" className="underline underline-offset-4 text-foreground hover:opacity-80">
            Learn more.
          </a>
        </p>
      </CardContent>
    </Card>
  )
}

export default TwoStepVerificationCard
export { TwoStepVerificationCard }
