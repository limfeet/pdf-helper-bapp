// components/auth/AuthLayout.tsx
import * as React from "react";
import { ThemeToggle } from "@/components/common/ThemeToggle";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      {/* 테마 토글 */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      {/* 브랜드 로고/제목 */}
      <div className="absolute top-8 left-8">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">PDF</span>
          </div>
          <span className="text-lg font-semibold">Helper</span>
        </div>
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}