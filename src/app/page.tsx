'use client';

import { ThreatReportSection } from "../components/threat-report-section"
import AttackFrequencyChart from "../components/attack-frequency-chart"
import SeverityBreakdownChart from "../components/severity-breakdown-chart"
import ThreatTypeChart from "../components/threat-type-chart"

export default function Dashboard() {
  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Dashboard</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* AI Threat Report - 4 columns */}
        <div className="col-span-4">
          <ThreatReportSection />
        </div>

        {/* Right side content - 8 columns */}
        <div className="col-span-8 space-y-6">
          {/* Attack Frequency Chart */}
          <AttackFrequencyChart />

          {/* Bottom row split into two */}
          <div className="grid grid-cols-2 gap-6">
            <SeverityBreakdownChart />
            <ThreatTypeChart />
          </div>
        </div>
      </div>
    </main>
  );
}

