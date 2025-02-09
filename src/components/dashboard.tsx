"use client";

import { useProfile } from "@/context/ProfileContext";
import { ThreatReportSection } from "./threat-report-section";
import AttackFrequencyChart from "./attack-frequency-chart";
import SeverityBreakdownChart from "./severity-breakdown-chart";
import ThreatTypeChart from "./threat-type-chart";

export default function Dashboard() {
  const { profileLoaded } = useProfile();

  if (!profileLoaded) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="w-10 h-10 border-t-2 border-b-2 border-white rounded-full animate-spin mx-auto"></div>
      </div>
    );
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
