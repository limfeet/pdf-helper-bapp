'use client'

import * as React from 'react'
import { Search, Menu, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { UserProfile } from '@/components/common/UserProfile'
import { cn } from '@/lib/utils'

interface CommonHeaderProps {
  onSearch?: (query: string) => void
  onMenuToggle?: () => void
  showMenuButton?: boolean
  className?: string
}

export function CommonHeader({
  onSearch,
  onMenuToggle,
  showMenuButton = true,
  className,
}: CommonHeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch?.(value)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className,
      )}
    >
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Menu Button */}
        {showMenuButton && (
          <Button variant="ghost" size="icon" onClick={onMenuToggle} className="shrink-0">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 bg-background/50 backdrop-blur-sm border-border/50"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Document processed</p>
                  <p className="text-xs text-muted-foreground">
                    Annual report has been successfully processed
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Storage warning</p>
                  <p className="text-xs text-muted-foreground">
                    You&apos;re using 80% of your storage limit
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">New feature available</p>
                  <p className="text-xs text-muted-foreground">Try our new AI chat features</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile - 기존 하드코딩된 부분을 UserProfile 컴포넌트로 교체 */}
          <UserProfile />
        </div>
      </div>
    </header>
  )
}
