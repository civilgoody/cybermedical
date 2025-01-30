'use client';

import { useState } from 'react';
import AttackReport from '@/components/AttackReport';
import { Card } from '@/components/ui/card';
import { mockReports } from '@/data/mockReports';

export default function Home() {
  const [reports] = useState(mockReports);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-green-900/20 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center cyber-glow text-green-400">
            Cyber Defense Monitor
          </h1>
          <p className="text-center mt-2 text-green-300/60">
            Real-time Attack Analysis and Reporting
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <AttackReport
              key={report.id}
              timestamp={new Date(report.timestamp).toLocaleString()}
              severity={report.severity}
              description={report.description}
              analysis={report.analysis}
            />
          ))}
          {reports.length === 0 && (
            <Card className="col-span-full p-8 text-center text-muted-foreground">
              No attack reports to display
            </Card>
          )}
        </div>
      </main>
    </div>
  );
} 
