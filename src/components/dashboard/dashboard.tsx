"use client";

import { useProfile } from "@/hooks/use-profile";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { ThreatReportSection } from "../reports/threat-report-section";
import AttackFrequencyChart from "./attack-frequency-chart";
import SeverityBreakdownChart from "./severity-breakdown-chart";
import ThreatTypeChart from "./threat-type-chart";

export default function Dashboard() {
  const { user, profile, isLoading, error } = useProfile();

  // Show loading if still checking auth or profile
  if (isLoading || !user) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  // Show error if there's an error
  if (error) {
    return <LoadingScreen message="Authentication error..." />;
  }

  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Dashboard</h1>
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
