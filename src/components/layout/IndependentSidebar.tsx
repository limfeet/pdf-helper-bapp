"use client"

import * as React from "react";
import { X, FileText, Home, File, MessageSquare, Settings, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidebarItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  isActive?: boolean;
}

interface IndependentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items?: SidebarItem[];
  className?: string;
}

const defaultItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/",
    isActive: false
  },
  {
    title: "Documents",
    icon: File,
    href: "/documents",
    badge: "4"
  },
  {
    title: "Chat",
    icon: MessageSquare,
    href: "/chat",
    badge: "2"
  },
  {
    title: "Pricing",
    icon: CreditCard,
    href: "/pricing",
    isActive: true
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings"
  }
];

export function IndependentSidebar({ 
  isOpen, 
  onClose, 
  items = defaultItems,
  className 
}: IndependentSidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-background/95 backdrop-blur-xl border-r border-border/50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">PDF Helper</span>
              <span className="text-xs text-muted-foreground">Admin Dashboard</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <div className="space-y-1">
            <div className="px-2 py-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Navigation
              </span>
            </div>
            
            {items.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  item.isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                onClick={onClose}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <Badge 
                    variant={item.isActive ? "secondary" : "secondary"} 
                    className="text-xs h-5 px-1.5"
                  >
                    {item.badge}
                  </Badge>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50">
          <div className="text-xs text-muted-foreground text-center">
            © 2024 PDF Helper
          </div>
        </div>
      </div>
    </>
  );
}