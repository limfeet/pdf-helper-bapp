// components/auth/LoginForm.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function LoginForm() {
  const { signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    // 개발환경에서는 바로 대시보드로 이동
    // if (process.env.NODE_ENV === 'development') {
    //   router.push('/');
    //   return;
    // }

    try {
      const jwt = await signInWithGoogle();
      
      if (jwt) {
        // JWT를 로컬스토리지에 저장 (선택사항)
        localStorage.setItem('firebase-jwt', jwt);
        
        // 대시보드로 이동
        router.push('/');
      }
    } catch (error) {
      console.error('로그인 중 오류:', error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">PDF Helper</CardTitle>
        <CardDescription>
          Google 계정으로 간편하게 로그인하세요
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Google로 계속하기
        </Button>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Flutter 앱과 동일한 계정으로 로그인됩니다
          </p>
        </div>
        
        <p className="mt-4 text-center text-xs text-muted-foreground">
          로그인하면{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            서비스 약관
          </a>{" "}
          및{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            개인정보 처리방침
          </a>
          에 동의하게 됩니다.
        </p>
      </CardContent>
    </Card>
  );
}