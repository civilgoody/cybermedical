'use client';

import { useState, useEffect } from 'react';
import AttackReport from '@/components/AttackReport';
import { Card } from '@/components/ui/card';
import { mockReports } from '@/data/mockReports';

interface AttackReport {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  analysis: string;
}

export default function Home() {
  const [reports, setReports] = useState<AttackReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch('/api/reports');
        if (!response.ok) throw new Error('Failed to fetch reports');
        const data = await response.json();
        
        // If no saved reports, use mock data
        setReports(data.length > 0 ? data : mockReports);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports');
        // Fallback to mock data on error
        setReports(mockReports);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();

    // Set up real-time updates
    const eventSource = new EventSource('/api/reports/stream');
    
    eventSource.onmessage = (event) => {
      const newReport = JSON.parse(event.data);
      setReports(prev => [newReport, ...prev].slice(0, 100)); // Keep latest 100 reports
    };

    eventSource.onerror = () => {
      console.error('SSE connection failed');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

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
        {error && (
          <div className="mb-4 p-4 border border-red-500/20 bg-red-500/10 text-red-400 rounded-md">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
          </div>
        ) : (
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
              <Card className="col-span-full p-8 text-center text-green-300/60 bg-black/20">
                No attack reports to display
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 
