'use client';
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card"
import { MoreVertical } from "lucide-react"
import { AttackReport } from "./attack-report"
import { ThreatType } from '@/types/supabase';

const refreshInterval = 60000;

interface Report {
  created_at: string;
  severity: "low" | "medium" | "high" | "critical";
  type: ThreatType;
  description: string;
  analysis: string;
}

export function ThreatReportSection() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports from the backend API
  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch('/api/reports');
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        } else {
          console.error('Failed to fetch reports');
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
      setLoading(false);
    }
    fetchReports();
    const interval = setInterval(fetchReports, refreshInterval);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-4 rounded-xl flex flex-col h-[820px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">AI Threat Report</h2>
        <button className="text-[#666666] hover:text-[#888888] transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
        <div className="space-y-4">
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : (
            reports.map((report, index) => (
              <AttackReport 
                key={index} 
                {...report} 
              />
            ))
          )}
        </div>
      </div>
    </Card>
  )
}

