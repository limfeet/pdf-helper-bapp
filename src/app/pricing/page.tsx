"use client"

import * as React from "react";
import { CommonHeader } from "@/components/layout/CommonHeader";
import { IndependentSidebar } from "@/components/layout/IndependentSidebar"; 
import { PricingToggle } from "@/components/features/pricing/PricingToggle";
import { PricingCard } from "@/components/features/pricing/PricingCard";
import { mockChatMessages, navigationItems } from "@/lib/mock-data";

// 요금제 데이터
const pricingPlans = [
  {
    name: "Starter",
    monthlyPrice: 15,
    yearlyPrice: 150,
    pages: "400 pages / month",
    features: ["PDF upload & processing", "Basic AI chat", "Email support", "5GB storage"]
  },
  {
    name: "Professional", 
    monthlyPrice: 30,
    yearlyPrice: 300,
    pages: "1000 pages / month",
    features: ["Everything in Starter", "Advanced AI", "Priority support", "20GB storage", "API access"],
    popular: true
  },
  {
    name: "Business",
    monthlyPrice: 50, 
    yearlyPrice: 500,
    pages: "4000 pages / month",
    features: ["Everything in Professional", "Team collaboration", "Custom integrations", "100GB storage"]
  },
  {
    name: "Enterprise",
    monthlyPrice: 0,
    yearlyPrice: 0,
    pages: "Unlimited",
    features: ["Everything in Business", "Custom solutions", "Dedicated support", "Unlimited storage"],
    isEnterprise: true
  }
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false); 

  React.useEffect(() => {
    setMounted(true);
  }, []);

  
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };


  if (!mounted) {
    return null;
  }

return (
  <>
    <CommonHeader onSearch={handleSearch}
    onMenuToggle={handleMenuToggle}
    showMenuButton={true} />

      <IndependentSidebar  
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />

    <main className="p-6 md:p-8 lg:p-12">  {/* 이 줄 추가 */}
     <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select the perfect plan for your PDF processing needs. Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Toggle */}
        <PricingToggle 
          isYearly={isYearly} 
          onToggle={setIsYearly} 
        />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-none">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.name}
              {...plan}
              isYearly={isYearly}
              className="h-full min-w-0"
            />
          ))}
        </div>
      </div>
      </main>
  </>
);
}