import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
// 🆕 추가: Firebase Auth Provider
import { AuthProvider } from "@/contexts/AuthContext"
// 🆕 수정: Toaster → Toaster from sonner
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PDF Helper - Admin Dashboard",
  description: "Modern admin dashboard for PDF document management and AI-powered chat",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* 🆕 추가: AuthProvider로 감싸서 전역에서 인증 상태 관리 */}
          <AuthProvider>
            {children}
          </AuthProvider>
          {/* 🆕 수정: sonner의 Toaster 사용 */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}