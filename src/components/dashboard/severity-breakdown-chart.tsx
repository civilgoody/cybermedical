"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { useSeverityBreakdown } from "@/hooks/use-dashboard-data"
import { SkeletonBarChart } from "@/components/ui/skeleton"

const SEVERITY_COLORS = {
  low: "#4CAF50",     // Green
  medium: "#FFC107",  // Yellow
  high: "#FF5722",    // Orange
  critical: "#FF29A8" // Primary pink color
};

export default function SeverityBreakdownChart() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('30d')
  const { data = [], isLoading, error } = useSeverityBreakdown(timeframe)

  if (isLoading) {
    return <SkeletonBarChart />;
  }

  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-4 sm:p-6 rounded-xl h-[350px] sm:h-[400px] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-900/20" />
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">Severity Breakdown</h3>
            <p className="text-xs sm:text-sm text-[#666666]">Severity counts over time</p>
          </div>
          <div className="flex gap-1 sm:gap-2">
            {(['24h', '7d', '30d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                  timeframe === tf
                    ? 'bg-primary text-white'
                    : 'bg-[#1A1A1A] text-[#666666] hover:text-white transition-colors'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[220px] sm:h-[300px]">
          {error ? (
            <div className="flex items-center justify-center h-full text-red-400">
              Error loading data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis 
                  dataKey="label" 
                  tick={{ fill: "#666666", fontSize: 10 }}
                  // axisLine={false}
                  // tickLine={false}
                />
                <YAxis 
                  tick={{ fill: "#666666", fontSize: 10 }}
                  // axisLine={false}
                  // tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  }}
                  labelStyle={{ color: "#666666" }}
                  cursor={{ fill: "#1A1A1A", strokeWidth: 0 }}
                />
                <Legend 
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
                  formatter={(value) => <span style={{ color: "#fff" }}>{value}</span>}
                />
                <Bar dataKey="low" stackId="a" fill={SEVERITY_COLORS.low} name="Low" radius={[4, 4, 0, 0]} />
                <Bar dataKey="medium" stackId="a" fill={SEVERITY_COLORS.medium} name="Medium" />
                <Bar dataKey="high" stackId="a" fill={SEVERITY_COLORS.high} name="High" />
                <Bar dataKey="critical" stackId="a" fill={SEVERITY_COLORS.critical} name="Critical" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Card>
  )
} 
