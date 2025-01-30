'use client';

import { useState, useEffect } from 'react';
import AttackReport from '@/components/AttackReport';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { mockReports } from '@/data/mockReports';
import type { AttackReport as AttackReportType } from '@/types/reports';

export default function Home() {
  const [reports, setReports] = useState<AttackReportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function fetchReports() {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/reports');
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      
      // If no saved reports, use mock data
      setReports(data.length > 0 ? data : mockReports);
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
      // Fallback to mock data on error
      setReports(mockReports);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-green-900/20 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center cyber-glow text-green-400">
            Cyber Defense Monitor
          </h1>
          <p className="text-center mt-2 text-green-300/60">
            Attack Analysis and Reporting
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-green-400">Attack Reports</h2>
          <Button
            onClick={fetchReports}
            disabled={loading || isRefreshing}
            variant="outline"
            className="border-green-900/20 hover:border-green-500/50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Reports'}
          </Button>
        </div>

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
                timestamp={report.created_at}
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
