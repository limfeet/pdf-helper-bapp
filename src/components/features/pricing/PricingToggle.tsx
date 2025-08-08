"use client"

import * as React from "react";
import { cn } from "@/lib/utils";

interface PricingToggleProps {
  isYearly: boolean;
  onToggle: (yearly: boolean) => void;
  className?: string;
}

export function PricingToggle({ isYearly, onToggle, className }: PricingToggleProps) {
  return (
    <div className={cn("flex justify-center items-center gap-4", className)}>
      <div className="flex items-center bg-muted rounded-lg p-1">
        <button
          onClick={() => onToggle(false)}
          className={cn(
            "px-6 py-2 rounded-md text-sm font-medium transition-all",
            !isYearly 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Monthly Plan
        </button>
        <button
          onClick={() => onToggle(true)}
          className={cn(
            "px-6 py-2 rounded-md text-sm font-medium transition-all",
            isYearly 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Annual Plan
        </button>
      </div>
      {/* {isYearly && (
        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
          Save more yearly!
        </span>
      )} */}
      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
          Save more yearly!
        </span>
    </div>
  );
}