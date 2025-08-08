"use client"

import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCards } from "@/components/features/dashboard/StatsCards";
import { FileUploadZone } from "@/components/features/file-management/FileUploadZone";
import { FileTable } from "@/components/features/file-management/FileTable";
import { ChatInterface } from "@/components/features/chat/ChatInterface";
import { mockFiles, mockChatMessages, navigationItems } from "@/lib/mock-data";
import { FileItem, ChatMessage } from "@/types";

export default function Dashboard() {
  const [files, setFiles] = React.useState<FileItem[]>(mockFiles);
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>(mockChatMessages);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // File handlers
  const handleFileSelect = (fileList: FileList) => {
    console.log("Files selected:", fileList);
    // Add logic to handle file upload
  };

  const handleFileView = (file: FileItem) => {
    console.log("View file:", file.name);
    // Add logic to view file
  };

  const handleFileDownload = (file: FileItem) => {
    console.log("Download file:", file.name);
    // Add logic to download file
  };

  const handleFileDelete = (file: FileItem) => {
    console.log("Delete file:", file.name);
    setFiles(files.filter(f => f.id !== file.id));
  };

  // Chat handlers
  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      type: "user",
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, newMessage]);
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: chatMessages.length + 2,
        type: "assistant",
        message: "I'm processing your question about the documents...",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Add search logic
  };

  if (!mounted) {
    return null;
  }

  return (
    <DashboardLayout 
      navigationItems={navigationItems} 
      onSearch={handleSearch}
    >
      {/* Stats Cards */}
      <StatsCards />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left Column - Upload and Files */}
        <div className="lg:col-span-2 space-y-4">
          {/* File Upload Zone */}
          <FileUploadZone onFileSelect={handleFileSelect} />

          {/* File Management Table */}
          <FileTable 
            files={files}
            onView={handleFileView}
            onDownload={handleFileDownload}
            onDelete={handleFileDelete}
          />
        </div>

        {/* Right Column - Chat Interface */}
        <div className="lg:col-span-1">
          <ChatInterface 
            messages={chatMessages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}