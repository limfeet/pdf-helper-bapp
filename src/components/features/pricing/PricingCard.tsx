'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PricingCardProps {
  name: string
  monthlyPrice: number
  yearlyPrice: number
  pages: string
  features: string[]
  popular?: boolean
  isEnterprise?: boolean
  isYearly?: boolean
  className?: string
}

export function PricingCard({
  name,
  monthlyPrice,
  yearlyPrice,
  pages,
  features,
  popular = false,
  isEnterprise = false,
  isYearly = false,
  className,
}: PricingCardProps) {
  const currentPrice = isYearly ? yearlyPrice : monthlyPrice
  const originalYearlyPrice = monthlyPrice * 12

  return (
    <Card
      className={cn(
        'relative transition-all hover:shadow-lg',
        popular && 'border-primary shadow-lg scale-105',
        !popular && 'hover:border-primary/50',
        className,
      )}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
            Most Popular
          </span>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <h3 className="text-xl font-bold">{name}</h3>

        <div className="mb-4">
          {isEnterprise ? (
            <div className="text-2xl font-bold">Need More?</div>
          ) : (
            <>
              <div className="text-3xl font-bold">
                ${currentPrice}
                <span className="text-base font-normal text-muted-foreground">
                  / {isYearly ? 'year' : 'month'}
                </span>
              </div>
              {isYearly && monthlyPrice > 0 && (
                <div className="text-sm text-muted-foreground line-through">
                  ${originalYearlyPrice}/year
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <Check className="w-4 h-4 text-green-500 mr-2" />
          {pages}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button
          className={cn(
            'w-full',
            popular || isEnterprise
              ? 'bg-primary hover:bg-primary/90'
              : 'bg-secondary hover:bg-secondary/80',
          )}
        >
          {isEnterprise ? 'Contact' : 'Buy'}
        </Button>

        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
