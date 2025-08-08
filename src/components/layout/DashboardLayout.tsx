"use client"

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { NavigationItem } from "@/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navigationItems: NavigationItem[];
  onSearch?: (query: string) => void;
}

export function DashboardLayout({ children, navigationItems, onSearch }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <AppSidebar navigationItems={navigationItems} />
        <SidebarInset>
          <Header onSearch={onSearch} />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}