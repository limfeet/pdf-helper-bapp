'use client'

import * as React from 'react'
import { CommonHeader } from '@/components/layout/CommonHeader'
import { IndependentSidebar } from '@/components/layout/IndependentSidebar'
import { StatsCards } from '@/components/features/dashboard/StatsCards'
import { FileUploadZone } from '@/components/features/file-management/FileUploadZone'
import { FileTable } from '@/components/features/file-management/FileTable'
import { ChatInterface } from '@/components/features/chat/ChatInterface'
import { mockFiles, mockChatMessages, navigationItems } from '@/lib/mock-data'
import { FileItem, ChatMessage } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import PointsNotice from '@/components/features/points/PointNotice'
import { usePointsFlow } from '@/components/features/points/usePointFlow'

export default function Dashboard() {
  const [files, setFiles] = React.useState<FileItem[]>(mockFiles)
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>(mockChatMessages)
  const [mounted, setMounted] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const { user } = useAuth()
  const isSubscriber = false

  const { beforeUpload } = usePointsFlow({
    isSubscriber,
    onQuoted: (pages, points) => {
      console.log('[QUOTE]', { pages, points })
    },
  })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleFileSelect = (fileList: FileList) => {
    console.log('Files selected:', fileList)
  }

  const handleFileView = (file: FileItem) => {
    console.log('View file:', file.name)
  }

  const handleFileDownload = (file: FileItem) => {
    console.log('Download file:', file.name)
  }

  const handleFileDelete = (file: FileItem) => {
    console.log('Delete file:', file.name)
    setFiles(files.filter((f) => f.id !== file.id))
  }

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      type: 'user',
      message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setChatMessages([...chatMessages, newMessage])

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: chatMessages.length + 2,
        type: 'assistant',
        message: "I'm processing your question about the documents...",
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }

      setChatMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const handleSearch = (query: string) => {
    console.log('Search query:', query)
  }

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <CommonHeader onSearch={handleSearch} onMenuToggle={handleMenuToggle} showMenuButton={true} />

      <IndependentSidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      <main className="p-4 md:p-6 lg:p-8">
        <StatsCards />

        <div className="grid gap-4 lg:grid-cols-3 mt-6">
          <div className="lg:col-span-2 space-y-4">
            <PointsNotice />
            <FileUploadZone beforeUpload={beforeUpload} onFileSelect={handleFileSelect} />

            <FileTable
              files={files}
              onView={handleFileView}
              onDownload={handleFileDownload}
              onDelete={handleFileDelete}
            />
          </div>

          <div className="lg:col-span-1">
            <ChatInterface messages={chatMessages} onSendMessage={handleSendMessage} />
          </div>
        </div>
      </main>
    </>
  )
}
