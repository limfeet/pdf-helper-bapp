// components/features/profile/PointRechargePro.tsx
'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type PointRechargeProProps = {
  currentPoints?: number
  /** 포인트 → 달러 환산 비율 (예: 10 = 1달러당 10포인트) */
  rate?: number
  /** PayPal hosted button id */
  hostedButtonId?: string
  currency?: 'USD' | 'EUR' | 'JPY' | 'KRW'
  /** 빠른 선택 포인트 프리셋 */
  presets?: number[]
  /** 최소/최대 포인트 한도 */
  minPoints?: number
  maxPoints?: number
  className?: string
}

const PointRechargePro: React.FC<PointRechargeProProps> = ({
  currentPoints = 245,
  rate = 10,
  hostedButtonId = '2KUN6Y6CTE5JU', // 예시
  currency = 'USD',
  presets = [50, 100, 250, 500],
  minPoints = 10,
  maxPoints = 100000,
  className,
}) => {
  const [points, setPoints] = React.useState<number>(0)

  const clamp = (v: number) => Math.min(Math.max(v, 0), maxPoints)
  const handlePreset = (p: number) => setPoints(p)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^\d]/g, '')
    setPoints(v ? clamp(parseInt(v, 10)) : 0)
  }

  // 금액 계산: 소수 2자리 고정
  const amount = React.useMemo(() => {
    if (rate <= 0 || points <= 0) return 0
    return Math.max(Number((points / rate).toFixed(2)), 0)
  }, [points, rate])

  const canPay = points >= minPoints && amount > 0

  return (
    <Card className={`w-full ${className ?? ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recharge Points</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* 현재 포인트 */}
        <div className="rounded-lg p-4 text-center bg-primary/10">
          <div className="text-2xl font-bold text-primary">{currentPoints.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Current Points</div>
        </div>

        {/* 프리셋 버튼 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((p) => {
            const selected = points === p
            return (
              <button
                key={p}
                type="button"
                onClick={() => handlePreset(p)}
                className={[
                  'rounded-md border px-3 py-2 text-sm font-medium transition',
                  selected
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border hover:bg-muted',
                ].join(' ')}
                aria-pressed={selected}
              >
                {p.toLocaleString()} pt
              </button>
            )
          })}
        </div>

        {/* 직접 입력 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Select Points (min {minPoints.toLocaleString()} pt)
            </label>
            <Input
              inputMode="numeric"
              pattern="[0-9]*"
              value={points ? points : ''}
              placeholder={`${minPoints}`}
              onChange={handleInput}
              aria-label="Points to recharge"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Payment Amount
            </label>
            <div className="h-10 rounded-md border px-3 flex items-center bg-background">
              <span className="text-sm">
                <strong>{currency} </strong>
                {amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* 환산 규칙 */}
        <div className="text-xs text-muted-foreground">
          $1 = {rate.toLocaleString()} points · Selected {points.toLocaleString()} points →
          <span className="ml-1">
            {currency}{' '}
            {amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        {canPay ? (
          // PayPal Buy Now 폼 (호스티드 버튼)
          <form
            action="https://www.paypal.com/cgi-bin/webscr"
            method="post"
            target="_top"
            className="w-full"
          >
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value={hostedButtonId} />
            <input type="hidden" name="currency_code" value={currency} />
            {/* 금액은 포인트/레이트로 계산된 결과 */}
            <input type="hidden" name="amount" value={amount} />
            <input
              type="image"
              src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif"
              className="mx-auto block border-0"
              name="submit"
              title="PayPal - The safer, easier way to pay online!"
              alt={`Pay ${currency} ${amount}`}
            />
          </form>
        ) : (
          <Button className="w-full" variant="secondary" disabled>
            Please select points
          </Button>
        )}

        <div className="text-center text-[11px] text-muted-foreground">
          Payment is processed through PayPal. For security, we recommend adding server-side amount
          verification.
        </div>
      </CardFooter>
    </Card>
  )
}

export default PointRechargePro
export { PointRechargePro }
