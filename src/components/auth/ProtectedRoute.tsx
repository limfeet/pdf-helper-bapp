/* eslint-disable react/react-in-jsx-scope */
// components/auth/ProtectedRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // 공개 페이지들 (인증 없이 접근 가능)
  const publicPaths = ['/login']
  const isPublicPath = publicPaths.includes(pathname)

  // 존재하는 페이지들 정의
  const validPaths = [
    '/',
    '/login',
    '/dashboard',
    '/admin',
    '/settings',
    '/profile',
    '/user',
    '/pricing',
    '/features',
    '/about',
    '/contact',
    '/privacy',
    '/landing',
    '/terms',
    '/sponsor',
  ]

  const isValidPath = validPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/'),
  )

  // ✅ useEffect를 항상 최상단에!
  useEffect(() => {
    // 유효하지 않은 페이지면 로그만 찍고 리턴
    if (!isValidPath) {
      console.log('🚫 BLOCKED:', pathname)
      return
    }

    // 공개 페이지면 통과
    if (isPublicPath) return

    // 로딩이 끝나고 사용자가 없으면 로그인 페이지로 리다이렉트
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router, isPublicPath, pathname, isValidPath])

  // 존재하지 않는 페이지면 아예 차단
  if (!isValidPath) {
    return null
  }

  // 로딩 중이면 로딩 화면
  if (loading && !isPublicPath) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )
    )
  }

  // 공개 페이지거나 인증된 사용자면 콘텐츠 표시
  if (isPublicPath || user) {
    return <>{children}</>
  }

  // 인증 안 된 사용자는 아무것도 렌더링하지 않음 (보안)
  return null
}
