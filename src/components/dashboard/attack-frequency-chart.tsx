"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useAttackFrequency } from "@/hooks/use-dashboard-data"
import { SkeletonLineChart } from "@/components/ui/skeleton"

export default function AttackFrequencyChart() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('30d');
  const { data = [], isLoading, error } = useAttackFrequency(timeframe)

  if (isLoading) {
    return <SkeletonLineChart />;
  }

  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-4 sm:p-6 rounded-xl relative overflow-hidden h-[350px] sm:h-[400px]">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-900/20" />

      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">Attack Frequency</h3>
            <p className="text-xs sm:text-sm text-[#666666]">Number of attacks over time</p>
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

        <div className="h-[200px] sm:h-[250px] w-full">
          {error ? (
            <div className="flex items-center justify-center h-full text-red-400">
              Error loading data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666666", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666666", fontSize: 12 }}
                  tickFormatter={(value) => `${value}`}
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
                  cursor={{ stroke: "#666666", strokeWidth: 1, strokeDasharray: "4 4" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#FF29A8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    fill: "#FF29A8",
                    stroke: "#141414",
                    strokeWidth: 2
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Card>
  )
} 
