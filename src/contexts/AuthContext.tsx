// contexts/AuthContext.tsx
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  signInWithPopup,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { serverLogout } from '@/lib/sessionApi'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<string | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Firebase Auth 상태 변화 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Google 로그인
  const signInWithGoogle = async (): Promise<string | null> => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // Firebase ID Token (JWT) 가져오기
      const idToken = await user.getIdToken()

      console.log('로그인 성공:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      })

      return idToken
    } catch (error) {
      console.error('Google 로그인 오류:', error)

      // Firebase Auth 에러인 경우 처리
      if (error instanceof Error && 'code' in error) {
        // 팝업이 닫혔을 때의 오류는 무시
        if ((error as { code: string }).code !== 'auth/popup-closed-by-user') {
          throw error
        }
      } else {
        throw error
      }

      return null
    } finally {
      setLoading(false)
    }
  }

  // 로그아웃
  const signOut = async (): Promise<void> => {
    try {
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''
        if (apiKey) {
          await serverLogout(apiKey)
        }
      } catch (e) {
        console.warn('백엔드 로그아웃 실패:', e)
      }
      try {
        await firebaseSignOut(auth)
      } catch (e) {
        console.warn('Firebase 로그아웃 실패:', e)
      }
      // 3. 로컬 정리 (항상 실행)
      localStorage.removeItem('firebase-jwt')
      console.log('로그아웃 성공')
    } catch (error) {
      console.error('로그아웃 오류:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
