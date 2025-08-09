'use client'

import * as React from 'react'
import { Send } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { ChatMessage } from '@/types'

interface ChatInterfaceProps {
  messages?: ChatMessage[]
  onSendMessage?: (message: string) => void
  className?: string
}

export function ChatInterface({ messages = [], onSendMessage, className }: ChatInterfaceProps) {
  const [message, setMessage] = React.useState('')

  const handleSend = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className={cn('h-full flex flex-col backdrop-blur-sm bg-background/95', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Document Q&A</CardTitle>
        <CardDescription>Ask questions about your uploaded documents</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 space-y-4 mb-4 max-h-96 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex', msg.type === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                  msg.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted',
                )}
              >
                <p>{msg.message}</p>
                <span className="text-xs opacity-70 mt-1 block">{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask a question about your documents..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[40px] resize-none"
            rows={1}
          />
          <Button size="icon" className="shrink-0" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
