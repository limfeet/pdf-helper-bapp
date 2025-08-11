'use client'

import * as React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Heart } from 'lucide-react'

type SupportCardProps = {
  title?: string
  description?: string
  paypalHostedButtonId?: string // PayPal hosted button ID
  currency?: 'USD' | 'EUR' | 'JPY' | 'KRW'
  presets?: number[] // quick amounts (in chosen currency)
  className?: string
}

const SupportCard: React.FC<SupportCardProps> = ({
  title = 'Support this project',
  description = 'If this project helped you, a small donation goes a long way. All proceeds fund hosting and ongoing development.',
  paypalHostedButtonId = 'YOUR_HOSTED_BUTTON_ID', // replace with your ID
  currency = 'USD',
  presets = [3, 5, 10, 25],
  className,
}) => {
  const [amount, setAmount] = React.useState<number | ''>('')
  const [note, setNote] = React.useState('')
  const [monthly, setMonthly] = React.useState(false)
  const [anonymous, setAnonymous] = React.useState(false)

  const onPreset = (v: number) => setAmount(v)
  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^\d.]/g, '')
    setAmount(v === '' ? '' : Number(v))
  }

  const isValid = typeof amount === 'number' && amount >= 1

  return (
    <Card className={`w-full ${className ?? ''}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Presets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((p) => {
            const selected = amount === p
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPreset(p)}
                aria-pressed={selected}
                className={[
                  'rounded-md border px-3 py-2 text-sm font-medium transition',
                  selected ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted',
                ].join(' ')}
              >
                {currency} {p}
              </button>
            )
          })}
        </div>

        {/* Custom amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Amount</label>
            <div className="flex items-center gap-2">
              <div className="h-10 rounded-md border px-3 flex items-center bg-background text-sm">
                {currency}
              </div>
              <Input
                value={amount === '' ? '' : amount}
                onChange={onAmountChange}
                inputMode="decimal"
                placeholder="e.g. 5"
                aria-label="Donation amount"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Minimum {currency} 1</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={monthly}
                onChange={(e) => setMonthly(e.target.checked)}
                className="h-4 w-4"
              />
              Monthly donation
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="h-4 w-4"
              />
              Donate anonymously
            </label>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Message (optional)
          </label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Leave a short note 🙂"
            rows={3}
          />
        </div>

        {/* Notice */}
        {monthly && (
          <div className="rounded-md border border-amber-300/50 bg-amber-100/70 dark:bg-amber-900/20 p-3 text-xs text-amber-800 dark:text-amber-300">
            Recurring billing with PayPal requires a subscription setup. This button processes a
            one-time donation.
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        {isValid ? (
          // PayPal one-time donation (Hosted Button)
          <form
            action="https://www.paypal.com/cgi-bin/webscr"
            method="post"
            target="_top"
            className="w-full"
          >
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value={paypalHostedButtonId} />
            <input type="hidden" name="currency_code" value={currency} />
            <input type="hidden" name="amount" value={amount} />
            {/* For anonymity/note, handle server-side ideally; here we pass it as a custom field */}
            <input type="hidden" name="custom" value={JSON.stringify({ anonymous, note })} />
            <input
              type="image"
              src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif"
              className="mx-auto block border-0"
              name="submit"
              title="PayPal - The safer, easier way to pay online!"
              alt={`Donate ${currency} ${amount}`}
            />
          </form>
        ) : (
          <Button className="w-full" variant="secondary" disabled>
            Enter an amount
          </Button>
        )}

        <div className="text-center text-[11px] text-muted-foreground">
          Donations are generally non-refundable. Please double-check your amount and details.
        </div>
      </CardFooter>
    </Card>
  )
}

export default SupportCard
export { SupportCard }
