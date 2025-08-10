'use client'

import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner' // ✅ sonner 사용
import { useAuth } from '@/contexts/AuthContext'
import { useAutoLogout } from '@/hooks/useAutoLogout'

export function AutoLogoutHandler() {
  const { user, loading } = useAuth() // ✅ logout 제거
  const router = useRouter()
  const pathname = usePathname()

  const rawApiKey = process.env.NEXT_PUBLIC_API_KEY || ''

  // 훅은 항상 호출해야 하므로, enabled일 때만 유효한 apiKey를 넘기고
  // 아니면 빈 문자열을 넘겨 훅 내부 가드(!apiKey)로 no-op 처리
  const enabled = !loading && pathname !== '/login' && !!user && !!rawApiKey

  const apiKey = enabled ? rawApiKey : '' // ✅ 훅 가드 트리거용

  useAutoLogout({
    apiKey,
    warnTimeMs: 25 * 60 * 1000,
    logoutTimeMs: 30 * 60 * 1000,
    heartbeatIntervalMs: 5 * 60 * 1000,

    onWarning: () => {
      // sonner는 기본 toast() 사용이 가장 호환이 좋아요
      toast.dismiss('warn')
      toast('세션이 5분 후 만료됩니다. 계속 사용하시려면 활동해주세요.', {
        id: 'warn',
        duration: 10000,
      })
    },

    onLogout: async () => {
      try {
        // 별도 logout 함수가 없으니 바로 라우팅
        toast.dismiss('warn')
        toast.error('세션이 만료되어 로그아웃되었습니다.', { duration: 5000 })
        router.push('/login')
      } catch (e) {
        console.error('로그아웃 처리 중 오류:', e)
        window.location.href = '/login'
      }
    },

    onSessionExtended: () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ 세션이 연장되었습니다')
      }
    },

    onError: (error, failureCount) => {
      console.error(`Heartbeat 실패 ${failureCount}회:`, error)
      if (failureCount === 2) {
        toast.dismiss('netwarn')
        toast('네트워크 연결을 확인해주세요. 불안정하면 자동 로그아웃될 수 있어요.', {
          id: 'netwarn',
          duration: 5000,
        })
      }
    },
  })

  return null
}
