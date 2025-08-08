// contexts/AuthContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInWithGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isDevelopment = process.env.NODE_ENV === 'development';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDevelopment && (!auth || !auth.onAuthStateChanged)) {
      // 개발환경에서 Firebase가 제대로 초기화되지 않은 경우
      console.log('개발환경 - Firebase Auth 우회');
      setUser({
        uid: 'dev-user-id',
        email: 'dev@example.com',
        displayName: 'Development User',
        photoURL: null,
      } as User);
      setLoading(false);
      return;
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn('Auth state 변경 감지 실패:', error);
      if (isDevelopment) {
        setUser({
          uid: 'dev-user-id',
          email: 'dev@example.com',
          displayName: 'Development User',
          photoURL: null,
        } as User);
      }
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async (): Promise<string | null> => {
    if (isDevelopment && (!auth || !googleProvider)) {
      console.log('개발환경 - 로그인 시뮬레이션');
      setUser({
        uid: 'dev-user-id',
        email: 'dev@example.com',
        displayName: 'Development User',
        photoURL: null,
      } as User);
      return 'dev-jwt-token'; // 개발환경용 더미 JWT
    }

    if (!auth || !googleProvider) {
      throw new Error('Firebase Auth가 초기화되지 않았습니다');
    }

    try {
      const { signInWithPopup } = await import('firebase/auth');
      const result = await signInWithPopup(auth, googleProvider);
      
      // Firebase ID Token (JWT) 가져오기
      const idToken = await result.user.getIdToken();
      return idToken;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  };

  const signIn = async () => {
    await signInWithGoogle();
  };

  const signOut = async () => {
    if (isDevelopment && !auth) {
      console.log('개발환경 - 로그아웃 시뮬레이션');
      setUser(null);
      return;
    }

    if (!auth) {
      throw new Error('Firebase Auth가 초기화되지 않았습니다');
    }

    try {
      await auth.signOut();
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}