"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { supabase } from "@/utils/supabase/client"

type SeverityData = {
  label: string
  low: number
  medium: number
  high: number
  critical: number
}

const SEVERITY_COLORS = {
  low: "#4CAF50",     // Green
  medium: "#FFC107",  // Yellow
  high: "#FF5722",    // Orange
  critical: "#FF29A8" // Pink (matching your theme)
};

export default function SeverityBreakdownChart() {
  const [data, setData] = useState<SeverityData[]>([])
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h')

  useEffect(() => {
    const fetchSeverityData = async () => {
      let query = supabase()
        .from('attack_reports')
        .select('created_at, severity')

      // Set time constraints based on timeframe
      const now = new Date()
      let startTime
      switch (timeframe) {
        case '7d':
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30d':
          startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        default:
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      }

      query = query.gte('created_at', startTime.toISOString())
      const { data: attacks, error } = await query

      if (error) {
        console.error('Error fetching severity data:', error)
        return
      }

      // Process data into time buckets with severity counts.
      // Use a Map keyed by a numeric timestamp (rounded to the hour).
      const timeData = new Map<number, { label: string; low: number; medium: number; high: number; critical: number }>()
      
      attacks?.forEach(attack => {
        const date = new Date(attack.created_at)
        // Round timestamp to the start of the hour.
        const timestamp = Math.floor(date.getTime() / (60 * 60 * 1000)) * (60 * 60 * 1000)
        // Format the label (for display) using the date for that hour.
        const label = date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric' 
        })
        // If there's no entry for that bucket yet, initialize it.
        if (!timeData.has(timestamp)) {
          timeData.set(timestamp, { label, low: 0, medium: 0, high: 0, critical: 0 })
        }
        const bucket = timeData.get(timestamp)!
        // Increment the appropriate severity count.
        const severity = attack.severity as "low" | "medium" | "high" | "critical"
        bucket[severity]++
      })

      // Convert the Map to an array, sorting by the numeric timestamp.
      const chartData: SeverityData[] = Array.from(timeData.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([_, values]) => values)

      setData(chartData)
    }

    fetchSeverityData()
    const interval = setInterval(fetchSeverityData, 60000)
    return () => clearInterval(interval)
  }, [timeframe])

  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Severity Breakdown</h3>
          <p className="text-sm text-[#666666]">Severity counts over time</p>
        </div>
        <div className="flex gap-2">
          {(['24h', '7d', '30d'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-full text-sm ${
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
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="label" tick={{ fill: "#666666", fontSize: 12 }} />
            <YAxis tick={{ fill: "#666666", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1A1A",
                border: "none",
                borderRadius: "8px",
                color: "#fff"
              }}
              labelStyle={{ color: "#666666" }}
              cursor={{ fill: "#1A1A1A", strokeWidth: 0 }}
            />
            <Legend />
            <Bar dataKey="low" stackId="a" fill="#4CAF50" name="Low" />
            <Bar dataKey="medium" stackId="a" fill="#FFC107" name="Medium" />
            <Bar dataKey="high" stackId="a" fill="#FF5722" name="High" />
            <Bar dataKey="critical" stackId="a" fill="#FF0000" name="Critical" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
} 
