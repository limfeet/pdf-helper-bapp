'use client'

import * as React from 'react'
import { CommonHeader } from '@/components/layout/CommonHeader'
import { IndependentSidebar } from '@/components/layout/IndependentSidebar'
import ProfileForm from '@/components/features/profile/ProfileForm' // default 임포트 주의
import { CurrentPlanCard } from '@/components/features/profile/CurrentPlanCard' // named
import PointRechargeCard from '@/components/features/profile/PointRechargeCard' // default
import { ChangePasswordCard } from '@/components/features/profile/ChangePasswordCard'
import { TwoStepVerificationCard } from '@/components/features/profile/TwoStepVerificationCard'
import ComingSoon from '@/components/ComingSoon'

export default function ProfilePage() {
  const [mounted, setMounted] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <>
      <CommonHeader
        onSearch={(q) => console.log('Search query:', q)}
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        showMenuButton
      />
      <IndependentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="p-4 md:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-3 mt-6">
          {/* 왼쪽: 프로필 */}
          <div className="lg:col-span-1">
            <ProfileForm />
          </div>

          {/* 오른쪽: 종(세로) 그리드 */}
          <div className="lg:col-span-2 space-y-6">
            <CurrentPlanCard />
            <ComingSoon blur={1} dimOpacity={0.35} className="rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PointRechargeCard />
                <ChangePasswordCard />
                <TwoStepVerificationCard />
              </div>
            </ComingSoon>
          </div>
        </div>
      </main>
    </>
  )
}
