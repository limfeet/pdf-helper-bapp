// components/ComingSoon.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type ComingSoonProps = {
  children: React.ReactNode
  label?: string
  blur?: number
  dimOpacity?: number
  className?: string
  emoji?: string
  mode?: 'emoji' | 'text' | 'both' // 표시 모드
}

export default function ComingSoon({
  children,
  label = 'UNDER DEVELOPMENT',
  blur = 2,
  dimOpacity = 0.35,
  className,
  emoji = '🚧',
  mode = 'both',
}: ComingSoonProps) {
  let displayText = ''

  switch (mode) {
    case 'emoji':
      displayText = emoji
      break
    case 'text':
      displayText = label
      break
    case 'both':
      displayText = `${label} ${emoji}`
      break
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* 원본 흐림 처리 */}
      <div style={{ filter: `blur(${blur}px)` }} className="pointer-events-none select-none">
        {children}
      </div>

      {/* 오버레이 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0,0,0,${dimOpacity})` }}
        />
        <span className="relative z-10 px-4 py-2 rounded-full bg-white/90 text-gray-900 font-semibold shadow-md">
          {displayText}
        </span>
      </div>
    </div>
  )
}
