'use client';
import React from 'react';
import { Card } from "@/components/ui/card"
import { MoreVertical } from "lucide-react"
import { AttackReport } from "./attack-report"
import { useReports } from "@/hooks/use-dashboard-data"
import { SkeletonCard } from "@/components/ui/skeleton"

export function ThreatReportSection() {
  const { data: reports = [], isLoading, error } = useReports()

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
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </>
          ) : error ? (
            <div className="text-red-400">Error loading reports</div>
          ) : (
            reports.map((report, index) => (
              <AttackReport 
                key={report.id || index} 
                {...report} 
              />
            ))
          )}
        </div>
      </div>
    </Card>
  )
}

