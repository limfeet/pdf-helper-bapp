// Next.js의 메타데이터 타입 import
import type { Metadata } from "next"
// Google Fonts에서 Inter 폰트 가져오기
import { Inter } from 'next/font/google'
// 전역 CSS 스타일 import
import "./globals.css"
// 다크모드/라이트모드 테마 관리용 Provider
import { ThemeProvider } from "@/components/theme-provider"
// Firebase 인증 상태를 전역에서 관리하는 Provider
import { AuthProvider } from "@/contexts/AuthContext"
// 알림/토스트 메시지 표시용 라이브러리
import { Toaster } from "sonner"
// 인증 가드 컴포넌트
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

// Inter 폰트 설정 (라틴 문자 서브셋)
const inter = Inter({ subsets: ["latin"] })

// 페이지의 메타데이터 설정 (SEO용)
export const metadata: Metadata = {
 title: "PDF Helper - Admin Dashboard",
 description: "Modern admin dashboard for PDF document management and AI-powered chat",
}

/**
* 루트 레이아웃 컴포넌트
* 모든 페이지에 공통으로 적용되는 최상위 레이아웃
* 
* 역할:
* 1. HTML 기본 구조 정의
* 2. 전역 폰트 적용
* 3. 테마 시스템 초기화
* 4. 인증 상태 전역 관리
* 5. 인증 가드로 보안 강화
* 6. 토스트 알림 시스템 설정
*/
export default function RootLayout({
 children, // 각 페이지의 실제 내용
}: {
 children: React.ReactNode
}) {
 return (
   <html lang="en" suppressHydrationWarning>
     <body className={inter.className}>
       {/* 다크모드/라이트모드 테마 관리자 */}
       <ThemeProvider
         attribute="class"              // 테마 적용 방식: CSS 클래스
         defaultTheme="system"          // 기본값: 시스템 설정 따름
         enableSystem                   // 시스템 테마 감지 활성화
         disableTransitionOnChange      // 테마 변경 시 애니메이션 비활성화
       >
         {/* 로그인/로그아웃 상태를 앱 전체에서 사용 가능하게 함 */}
         <AuthProvider>
           {/* 인증 가드: 로그인 안 한 사용자는 로그인 페이지로 리다이렉트 */}
           <ProtectedRoute>
             {children} {/* 실제 페이지 내용이 여기에 렌더링 */}
           </ProtectedRoute>
         </AuthProvider>
         
         {/* 알림 메시지 표시용 (성공/에러/경고 등) */}
         <Toaster />
       </ThemeProvider>
     </body>
   </html>
 )
}