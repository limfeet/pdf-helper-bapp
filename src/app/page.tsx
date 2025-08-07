"use client"

import * as React from "react"
import { Bell, ChevronDown, FileText, Home, MessageSquare, Moon, Search, Settings, Sun, Upload, User, X, Send, Download, Eye, Trash2, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

// Mock data for demonstration
const mockFiles = [
  {
    id: 1,
    name: "Annual Report 2024.pdf",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    status: "processed",
    pages: 45
  },
  {
    id: 2,
    name: "Marketing Strategy.pdf",
    size: "1.8 MB",
    uploadDate: "2024-01-14",
    status: "processing",
    pages: 32
  },
  {
    id: 3,
    name: "Financial Analysis.pdf",
    size: "3.2 MB",
    uploadDate: "2024-01-13",
    status: "failed",
    pages: 67
  },
  {
    id: 4,
    name: "User Manual.pdf",
    size: "5.1 MB",
    uploadDate: "2024-01-12",
    status: "processed",
    pages: 89
  }
]

const mockChatMessages = [
  {
    id: 1,
    type: "user",
    message: "What is the main topic of the Annual Report 2024?",
    timestamp: "10:30 AM"
  },
  {
    id: 2,
    type: "assistant",
    message: "The Annual Report 2024 focuses on the company's financial performance, strategic initiatives, and market expansion plans for the fiscal year.",
    timestamp: "10:31 AM"
  },
  {
    id: 3,
    type: "user",
    message: "Can you summarize the key financial metrics?",
    timestamp: "10:32 AM"
  }
]

const navigationItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "#",
    isActive: true
  },
  {
    title: "Documents",
    icon: FileText,
    url: "#",
    badge: "4"
  },
  {
    title: "Chat",
    icon: MessageSquare,
    url: "#",
    badge: "2"
  },
  {
    title: "Settings",
    icon: Settings,
    url: "#"
  }
]

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    processed: { icon: CheckCircle, color: "bg-green-500", text: "Processed" },
    processing: { icon: Loader2, color: "bg-yellow-500", text: "Processing" },
    failed: { icon: AlertCircle, color: "bg-red-500", text: "Failed" }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig]
  const Icon = config.icon
  
  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <Icon className={cn("h-3 w-3", status === "processing" && "animate-spin")} />
      {config.text}
    </Badge>
  )
}

function FileUploadZone() {
  const [isDragOver, setIsDragOver] = React.useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    // Handle file drop logic here
  }

  return (
    <Card className="border-2 border-dashed transition-colors duration-200 hover:border-primary/50">
      <CardContent 
        className={cn(
          "flex flex-col items-center justify-center p-8 text-center transition-colors duration-200",
          isDragOver && "bg-primary/5"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Upload PDF Files</h3>
        <p className="text-muted-foreground mb-4">
          Drag and drop your PDF files here, or click to browse
        </p>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Choose Files
        </Button>
      </CardContent>
    </Card>
  )
}

function ChatInterface() {
  const [message, setMessage] = React.useState("")

  return (
    <Card className="h-full flex flex-col backdrop-blur-sm bg-background/95">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Document Q&A</CardTitle>
        <CardDescription>Ask questions about your uploaded documents</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 space-y-4 mb-4 max-h-96 overflow-y-auto">
          {mockChatMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.type === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                  msg.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p>{msg.message}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask a question about your documents..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[40px] resize-none"
            rows={1}
          />
          <Button size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Sidebar className="backdrop-blur-xl bg-background/95 border-r border-border/50">
          <SidebarHeader className="border-b border-border/50 p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">PDF Helper</span>
                <span className="text-xs text-muted-foreground">Admin Dashboard</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        <a href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        
        <SidebarInset>
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-8 bg-background/50 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">Document processed</p>
                      <p className="text-xs text-muted-foreground">Annual Report 2024.pdf is ready</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">Processing failed</p>
                      <p className="text-xs text-muted-foreground">Financial Analysis.pdf encountered an error</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">John Doe</span>
                      <span className="text-xs text-muted-foreground">Admin</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="backdrop-blur-sm bg-background/95">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+2 from last week</p>
                </CardContent>
              </Card>
              <Card className="backdrop-blur-sm bg-background/95">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Processing</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Currently processing</p>
                </CardContent>
              </Card>
              <Card className="backdrop-blur-sm bg-background/95">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card className="backdrop-blur-sm bg-background/95">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4 GB</div>
                  <p className="text-xs text-muted-foreground">of 10 GB limit</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {/* Left Column - Upload and Files */}
              <div className="lg:col-span-2 space-y-4">
                {/* File Upload Zone */}
                <FileUploadZone />

                {/* File Management Table */}
                <Card className="backdrop-blur-sm bg-background/95">
                  <CardHeader>
                    <CardTitle>Recent Documents</CardTitle>
                    <CardDescription>Manage your uploaded PDF files</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Upload Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockFiles.map((file) => (
                          <TableRow key={file.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                {file.name}
                              </div>
                            </TableCell>
                            <TableCell>{file.size}</TableCell>
                            <TableCell>{file.uploadDate}</TableCell>
                            <TableCell>
                              <StatusBadge status={file.status} />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Chat Interface */}
              <div className="lg:col-span-1">
                <ChatInterface />
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
