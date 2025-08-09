export interface FileItem {
  id: number
  name: string
  size: string
  uploadDate: string
  status: 'processed' | 'processing' | 'failed'
  pages: number
}

export interface ChatMessage {
  id: number
  type: 'user' | 'assistant'
  message: string
  timestamp: string
}

import { LucideIcon } from 'lucide-react'

export interface NavigationItem {
  title: string
  icon: LucideIcon
  url: string
  isActive?: boolean
  badge?: string
}

export interface StatsCard {
  title: string
  value: string
  description: string
  icon: LucideIcon
}

export interface NotificationItem {
  id: number
  title: string
  description: string
  timestamp?: string
}
