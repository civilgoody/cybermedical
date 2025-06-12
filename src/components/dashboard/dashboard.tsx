"use client";

import { useRefreshDashboard } from "@/hooks/use-dashboard-data";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ThreatReportSection } from "../reports/threat-report-section";
import AttackFrequencyChart from "./attack-frequency-chart";
import SeverityBreakdownChart from "./severity-breakdown-chart";
import ThreatTypeChart from "./threat-type-chart";

export default function Dashboard() {
  const { refresh, isRefreshing } = useRefreshDashboard();

  return (
    <main className="flex-1 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Dashboard</h1>
        <Button
          onClick={refresh}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 self-start sm:self-auto"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AI Threat Report Section */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <ThreatReportSection />
        </div>
        
        {/* Charts and additional info */}
        <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
          {/* Attack Frequency Chart - Full width */}
          <div className="w-full">
            <AttackFrequencyChart />
          </div>
          
          {/* Bottom Charts Grid - Keep them in same row on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SeverityBreakdownChart />
            <ThreatTypeChart />
          </div>
        </div>
      </div>
    </main>
  );
} 
