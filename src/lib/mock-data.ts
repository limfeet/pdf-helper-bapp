import { Home, FileText, MessageSquare, Settings } from 'lucide-react';
import { FileItem, ChatMessage, NavigationItem } from '@/types';

export const mockFiles: FileItem[] = [
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
];

export const mockChatMessages: ChatMessage[] = [
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
];

export const navigationItems: NavigationItem[] = [
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
];