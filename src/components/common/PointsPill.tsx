'use client'

import * as React from 'react'
import { Coins, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PointsPillProps = {
  apiBase?: string
  apiKey?: string
  pollMs?: number
  className?: string
  onClick?: () => void
}

export function PointsPill({
  apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '',
  apiKey = process.env.NEXT_PUBLIC_API_KEY,
  pollMs = 30_000,
  className,
  onClick,
}: PointsPillProps) {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [points, setPoints] = React.useState<number | null>(null)
  const [isSubscriber, setIsSubscriber] = React.useState<boolean>(false)

  const fetchBalance = React.useCallback(async () => {
    const jwt = localStorage.getItem('firebase-jwt')
    console.log('[PointsPill] firebase-jwt =', jwt)

    if (!jwt) {
      console.warn('[PointsPill] JWT 없음 → 호출 스킵')
      setLoading(false)
      setPoints(null)
      setIsSubscriber(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/points/me`, {
        method: 'GET',
        credentials: 'include', // 세션 쿠키 포함
        headers: {
          'x-api-key': apiKey || '',
          authorization: `Bearer ${jwt}`,
        },
        cache: 'no-store',
      })
      console.log('[PointsPill] status', res.status)

      if (!res.ok) {
        const msg = await res.text().catch(() => '')
        throw new Error(msg || `HTTP ${res.status}`)
      }

      const data = await res.json()
      console.log('[PointsPill] data', data)
      setPoints(typeof data.balance === 'number' ? data.balance : 0)
      setIsSubscriber(!!data.is_subscriber)
    } catch (e: any) {
      console.error('[PointsPill] fetch error', e)
      setError(e?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [apiBase, apiKey])

  React.useEffect(() => {
    fetchBalance()
    if (!pollMs) return
    const id = setInterval(fetchBalance, pollMs)
    return () => clearInterval(id)
  }, [fetchBalance, pollMs])

  const display = points === null ? (loading ? '...' : '-') : points.toLocaleString()

  if (error) {
    return (
      <Button
        variant="destructive"
        size="sm"
        onClick={fetchBalance}
        className="h-9 rounded-full px-3 gap-2"
      >
        <RotateCw className="h-4 w-4" />
        <span className="text-sm">재시도</span>
      </Button>
    )
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onClick}
      disabled={loading}
      className={cn(
        'h-9 rounded-full px-3 gap-2 bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100',
        'dark:bg-amber-900/30 dark:text-amber-50 dark:border-amber-800 dark:hover:bg-amber-900/50',
        className,
      )}
      title={isSubscriber ? '구독자' : '비구독자'}
    >
      <Coins className="h-4 w-4" />
      <span className="text-sm tabular-nums">{display} P</span>
      {loading && <RotateCw className="h-3.5 w-3.5 animate-spin opacity-70" />}
    </Button>
  )
}

export default PointsPill
