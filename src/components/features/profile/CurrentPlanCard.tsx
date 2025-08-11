'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ComingSoon from '@/components/ComingSoon'

interface CurrentPlanProps {
  plan?: {
    name: string
    description: string
    price: number
    isPopular?: boolean
    activeUntil: string
    daysRemaining: number
    totalDays: number
  }
  onUpgradePlan?: () => void
  onCancelSubscription?: () => void
}

const CurrentPlanCard: React.FC<CurrentPlanProps> = ({
  plan = {
    name: 'Basic',
    description: 'A simple start for everyone',
    price: 199,
    isPopular: true,
    activeUntil: 'Dec 09, 2021',
    daysRemaining: 6,
    totalDays: 30,
  },
  onUpgradePlan = () => console.log('Upgrade plan'),
  onCancelSubscription = () => console.log('Cancel subscription'),
}) => {
  const total = Math.max(1, plan.totalDays)
  const remaining = Math.min(plan.daysRemaining, total)
  const elapsed = total - remaining
  const progress = Math.round((elapsed / total) * 100)
  const showAlert = remaining <= 7

  return (
    <ComingSoon blur={1} dimOpacity={0.35} className="rounded-2xl">
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Current Plan</CardTitle>
        </CardHeader>

        <CardContent>
          {/* 모바일: 1열(알림/프로그레스 먼저), md+: 좌(정보) 2 / 우(알림+프로그레스) 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 우측 패널: 알림 + 진행률 (모바일에서 먼저 보이도록 order-1) */}
            <aside className="order-1 md:order-2 md:col-span-1 min-w-0 space-y-4">
              {showAlert && (
                <div className="rounded-lg border border-amber-300/40 bg-amber-100/60 dark:bg-amber-900/20 p-4">
                  <h4 className="text-sm font-medium text-amber-900 dark:text-amber-200">
                    We need your attention!
                  </h4>
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    Your plan requires update
                  </p>
                </div>
              )}

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Days</span>
                  <span className="text-sm text-muted-foreground">
                    {elapsed} of {total} days
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-[width] duration-300"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Plan usage progress"
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {remaining} day{remaining !== 1 ? 's' : ''} remaining until your plan requires
                  update
                </p>
              </div>
            </aside>

            {/* 좌측 패널: 플랜 정보 + 버튼 (모바일에서 두 번째로) */}
            <section className="order-2 md:order-1 md:col-span-2 min-w-0 space-y-5">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Your Current Plan is {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Active until {plan.activeUntil}
                </h4>
                <p className="text-sm text-muted-foreground">
                  We will send you a notification upon subscription expiration
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-foreground">
                    ${plan.price} / month
                  </span>
                  {plan.isPopular && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                      popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Standard plan for small to medium businesses
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="button" onClick={onUpgradePlan} className="sm:flex-1">
                  Upgrade plan
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="sm:flex-1"
                  onClick={onCancelSubscription}
                >
                  Cancel subscription
                </Button>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </ComingSoon>
  )
}

export default CurrentPlanCard
export { CurrentPlanCard }
