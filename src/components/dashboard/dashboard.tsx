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
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <Button
          onClick={refresh}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {/* AI Threat Report Section */}
        <div className="col-span-4">
          <ThreatReportSection />
        </div>
        {/* Charts and additional info */}
        <div className="col-span-8 space-y-6">
          <AttackFrequencyChart />
          <div className="grid grid-cols-2 gap-6">
            <SeverityBreakdownChart />
            <ThreatTypeChart />
          </div>
        </div>
      </div>
    </main>
  );
} 
