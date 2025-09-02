// src/features/points/usePointsFlow.ts
'use client'

import { useState, useCallback } from 'react'
import { estimatePoints, PAGES_PER_POINT } from './calc'

import { useAuth } from '@/contexts/AuthContext'
import { countPagesClient } from './pageCounter' // ✅ 여기만 바뀜
import { hold, precharge } from './api'
import { toast } from 'sonner'

type UsePointsFlowOptions = {
  isSubscriber: boolean
  onQuoted?: (pages: number, points: number) => void
}

export function usePointsFlow({ isSubscriber, onQuoted }: UsePointsFlowOptions) {
  const [lastQuote, setLastQuote] = useState<{ pages: number; points: number } | null>(null)
  const { user } = useAuth()

  const beforeUpload = useCallback(
    async (files: File[]) => {
      if (!files.length || !user) return false

      // 1) 페이지 수 추정 (pdf-lib 사용)
      let pages = 0
      try {
        pages = await countPagesClient(files)
      } catch (e) {
        console.error('페이지 수 계산 실패:', e)
        alert('PDF 페이지 수 계산에 실패했어. 나중에 다시 시도해줘.')
        return false
      }

      const points = estimatePoints(pages)
      setLastQuote({ pages, points })
      onQuoted?.(pages, points)

      // 2) 고지/동의
      const notice = isSubscriber
        ? `이 작업은 총 ${pages}페이지예요.\n필요 포인트: ${points}P (${PAGES_PER_POINT}p = 1P)\n\n구독 고객은 "성공 시에만 결제"입니다.\n진행할까요?`
        : `이 작업은 총 ${pages}페이지예요.\n필요 포인트: ${points}P (${PAGES_PER_POINT}p = 1P)\n\n[중요] 비구독은 선결제·환불 불가(시스템 장애 제외)입니다.\n계속할까요?`

      if (!window.confirm(notice)) return false

      // 3) 결제/예약 호출
      try {
        const token = await user.getIdToken()
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
        const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''
        const jobId = `job-${Date.now()}`

        if (isSubscriber) await hold({ token, apiBaseUrl, apiKey, jobId, points })
        else await precharge({ token, apiBaseUrl, apiKey, jobId, points })

        return true
      } catch (e) {
        console.error('결제/예약 실패:', e)
        toast.error('결제/예약 실패', {
          description: '포인트 잔액을 확인하거나 다시 시도하세요.',
        })
        alert('결제/예약에 실패했습니다. 포인트 잔액을 확인하거나 다시 시도하세요.')
        return false
      }
    },
    [isSubscriber, onQuoted, user],
  )

  return { beforeUpload, lastQuote }
}
