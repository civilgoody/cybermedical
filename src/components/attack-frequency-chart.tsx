"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { supabase } from "@/utils/supabase/client"

type AttackData = {
  hour: string;
  count: number;
}

export default function AttackFrequencyChart() {
  const [data, setData] = useState<AttackData[]>([]);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('30d');

  useEffect(() => {
    const fetchAttackData = async () => {
      let query = supabase()
        .from('attack_reports')
        .select('created_at');

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
        console.error('Error fetching attack data:', error);
        return;
      }

      // Use a Map keyed by a rounded timestamp (to the hour) to store the count and label.
      const hourlyData = new Map<number, { label: string; count: number }>();

      attacks?.forEach(attack => {
        const date = new Date(attack.created_at);
        // Round the timestamp to the start of the hour
        const timestamp = Math.floor(date.getTime() / (60 * 60 * 1000)) * (60 * 60 * 1000);
        // Format the label (you can adjust the options as needed).
        const label = date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric' 
        });
        // Update the Map
        const entry = hourlyData.get(timestamp) || { label, count: 0 };
        entry.count++;
        hourlyData.set(timestamp, entry);
      });

      // Convert the map to an array, sort by timestamp, then map to the expected format
      const chartData = Array.from(hourlyData.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([_, { label, count }]) => ({ hour: label, count }));

      setData(chartData);
    };

    fetchAttackData();
    // Set up polling every minute
    const interval = setInterval(fetchAttackData, 60000);
    return () => clearInterval(interval);
  }, [timeframe]);

  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl relative overflow-hidden h-[400px]">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-900/20" />

      <div className="relative">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-semibold text-white">Attack Frequency</h3>
            <p className="text-sm text-[#666666]">Number of attacks over time</p>
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

        <div className="h-[250px] w-full">
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
        </div>
      </div>
    </Card>
  )
} 
