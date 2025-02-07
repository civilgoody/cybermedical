"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { supabase } from "@/utils/supabase/client"

type SeverityData = {
  time: string;
  low: number;
  medium: number;
  high: number;
  critical: number;
}

const SEVERITY_COLORS = {
  low: "#4CAF50",     // Green
  medium: "#FFC107",  // Yellow
  high: "#FF5722",    // Orange
  critical: "#FF29A8" // Pink (matching your theme)
};

export default function SeverityBreakdownChart() {
  const [data, setData] = useState<SeverityData[]>([]);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    const fetchSeverityData = async () => {
      let query = supabase()
        .from('attack_reports')
        .select('created_at, severity');

      // Add time constraints based on timeframe
      const now = new Date();
      let startTime;
      switch (timeframe) {
        case '7d':
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default: // 24h
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }

      query = query.gte('created_at', startTime.toISOString());
      const { data: attacks, error } = await query;

      if (error) {
        console.error('Error fetching severity data:', error);
        return;
      }

      // Process data into time buckets with severity counts
      const timeData = new Map<string, { low: number; medium: number; high: number; critical: number }>();
      
      attacks?.forEach(attack => {
        const date = new Date(attack.created_at);
        const timeKey = date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric'
        });

        if (!timeData.has(timeKey)) {
          timeData.set(timeKey, { low: 0, medium: 0, high: 0, critical: 0 });
        }
        const current = timeData.get(timeKey)!;
        current[attack.severity as keyof typeof current]++;
      });

      // Convert to array and sort by time
      const chartData = Array.from(timeData.entries())
        .map(([time, counts]) => ({
          time,
          ...counts
        }))
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

      setData(chartData);
    };

    fetchSeverityData();
    // Set up polling every minute
    const interval = setInterval(fetchSeverityData, 60000);
    return () => clearInterval(interval);
  }, [timeframe]);

  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-900/20" />

      <div className="relative">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-semibold text-white">Severity Breakdown</h3>
            <p className="text-sm text-[#666666]">Attack severity distribution</p>
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

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="time"
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
                  color: "#fff"
                }}
                labelStyle={{ color: "#666666" }}
              />
              <Legend 
                iconType="circle"
                wrapperStyle={{
                  paddingTop: "20px"
                }}
              />
              <Bar dataKey="critical" stackId="a" fill={SEVERITY_COLORS.critical} name="Critical" />
              <Bar dataKey="high" stackId="a" fill={SEVERITY_COLORS.high} name="High" />
              <Bar dataKey="medium" stackId="a" fill={SEVERITY_COLORS.medium} name="Medium" />
              <Bar dataKey="low" stackId="a" fill={SEVERITY_COLORS.low} name="Low" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
} 
