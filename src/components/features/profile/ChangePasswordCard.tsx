'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'

type ChangePasswordCardProps = {
  className?: string
  onChangePassword?: (newPassword: string) => Promise<void> | void
}

const ChangePasswordCard: React.FC<ChangePasswordCardProps> = ({ className, onChangePassword }) => {
  const [pw, setPw] = React.useState('')
  const [pw2, setPw2] = React.useState('')
  const [show1, setShow1] = React.useState(false)
  const [show2, setShow2] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const meetsLen = pw.length >= 8
  const meetsUpper = /[A-Z]/.test(pw)
  const meetsSymbol = /[^A-Za-z0-9]/.test(pw)
  const match = pw.length > 0 && pw === pw2
  const isValid = meetsLen && meetsUpper && meetsSymbol && match

  const handleSubmit = async () => {
    if (!isValid || loading) return
    try {
      setLoading(true)
      await onChangePassword?.(pw)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={`w-full ${className ?? ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Change Password</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 안내 배너 */}
        <div className="rounded-md border border-amber-300/50 bg-amber-100/70 dark:bg-amber-900/20 p-4">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
            Ensure that these requirements are met
          </p>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Minimum 8 characters long, uppercase &amp; symbol
          </p>
        </div>

        {/* 비밀번호 입력 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Input
              type={show1 ? 'text' : 'password'}
              placeholder="New Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              aria-label="New password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow1((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              aria-label={show1 ? 'Hide password' : 'Show password'}
            >
              {show1 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="relative">
            <Input
              type={show2 ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              aria-label="Confirm password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow2((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              aria-label={show2 ? 'Hide password' : 'Show password'}
            >
              {show2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* 유효성 피드백(아주 가볍게) */}
        {!match && pw2.length > 0 && (
          <p className="text-xs text-destructive">Passwords do not match.</p>
        )}

        {/* 제출 버튼 */}
        <Button
          type="button"
          className="mt-1"
          disabled={!isValid || loading}
          onClick={handleSubmit}
        >
          {loading ? 'Changing…' : 'Change password'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default ChangePasswordCard
export { ChangePasswordCard }
