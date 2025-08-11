// app/sponsor/page.tsx
'use client'

import * as React from 'react'
import { CommonHeader } from '@/components/layout/CommonHeader'
import { IndependentSidebar } from '@/components/layout/IndependentSidebar'
import { SupportCard } from '@/components/sponsor/SupportCard'

export default function SponsorPage() {
  const [mounted, setMounted] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <>
      <CommonHeader
        onSearch={() => {}}
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        showMenuButton
      />
      <IndependentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="mx-auto max-w-3xl px-6 py-8">
        <section className="space-y-6">
          <h1 className="text-2xl font-semibold">Sponsor</h1>
          <p className="text-sm text-muted-foreground">
            Your support helps cover servers, domain, and ongoing development. Thank you!
          </p>
          <SupportCard paypalHostedButtonId="YOUR_HOSTED_BUTTON_ID" />
        </section>
      </main>
    </>
  )
}
