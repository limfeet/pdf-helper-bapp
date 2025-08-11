'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ComingSoon from '@/components/ComingSoon'

interface ProfileFormProps {
  user?: {
    name: string
    role: string
    avatar: string
    tasksCompleted: number
    projectsCompleted: number
    billingEmail: string
    status: 'Active' | 'Inactive' | 'Suspended'
    taxId: string
    contact: string
    language: string
    country: string
  }
  onEdit?: () => void
  onSuspend?: () => void
}

export default function ProfileForm({
  user = {
    name: 'Selina Kyle',
    role: 'Admin',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    tasksCompleted: 1230,
    projectsCompleted: 568,
    billingEmail: 'irena.dubrovna@wayne.com',
    status: 'Active',
    taxId: 'Tax-8894',
    contact: '(829) 537-0057',
    language: 'Korean',
    country: '한국',
  },
  onEdit = () => console.log('Edit profile'),
  onSuspend = () => console.log('Suspend account'),
}: ProfileFormProps) {
  const badgeClass =
    user.status === 'Active'
      ? 'text-emerald-600 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/40'
      : user.status === 'Suspended'
      ? 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-950/40'
      : 'text-muted-foreground bg-muted/40'

  return (
    <ComingSoon blur={1} dimOpacity={0.35} className="rounded-2xl">
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex flex-col items-center">
            <div className="w-20 aspect-square rounded-xl overflow-hidden ring-1 ring-border mb-3">
              {/* next/image 써도 됨 */}
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            </div>
            <CardTitle className="text-lg">{user.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.role}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/60 p-3 bg-card/40">
              <div className="text-xs text-muted-foreground">Task Done</div>
              <div className="text-xl font-semibold text-foreground">
                {user.tasksCompleted.toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl border border-border/60 p-3 bg-card/40">
              <div className="text-xs text-muted-foreground">Project Done</div>
              <div className="text-xl font-semibold text-foreground">{user.projectsCompleted}</div>
            </div>
          </div>

          {/* Details */}
          <div>
            <h3 className="text-xs font-medium tracking-wide text-muted-foreground mb-3">
              DETAILS
            </h3>
            <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
              <span className="text-muted-foreground">Name</span>
              <span className="text-foreground">{user.name}</span>

              <span className="text-muted-foreground">Billing Email</span>
              <span className="text-foreground truncate" title={user.billingEmail}>
                {user.billingEmail}
              </span>

              <span className="text-muted-foreground">Status</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
                {user.status}
              </span>

              <span className="text-muted-foreground">Role</span>
              <span className="text-foreground">{user.role}</span>

              <span className="text-muted-foreground">Tax ID</span>
              <span className="text-foreground">{user.taxId}</span>

              <span className="text-muted-foreground">Contact</span>
              <span className="text-foreground truncate" title={user.contact}>
                {user.contact}
              </span>

              <span className="text-muted-foreground">Language</span>
              <span className="text-foreground">{user.language}</span>

              <span className="text-muted-foreground">Country</span>
              <span className="text-foreground">{user.country}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button type="button" size="sm" onClick={onEdit} className="flex-1">
            Edit
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={onSuspend}
            className="flex-1"
          >
            Suspend
          </Button>
        </CardFooter>
      </Card>
    </ComingSoon>
  )
}
export { ProfileForm }
