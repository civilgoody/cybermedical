"use client"

import { Card } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", value: 85 },
  { month: "Feb", value: 25 },
  { month: "Mar", value: 80 },
  { month: "Apr", value: 78 },
  { month: "May", value: 45 },
  { month: "Jun", value: 75 },
  { month: "Jul", value: 35 },
  { month: "Aug", value: 78 },
  { month: "Sep", value: 68 },
  { month: "Oct", value: 55 },
  { month: "Nov", value: 85 },
  { month: "Dec", value: 32 },
]

export default function NetworkTrafficChart() {
  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl relative overflow-hidden">
      {/* Purple gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-900/20" />

      <div className="relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-semibold text-white">Live Network Traffic</h3>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1A1A] text-[#666666] hover:text-white transition-colors">
            <span className="text-sm">Month</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666666", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666666", fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
                ticks={[0, 20, 40, 60, 80, 100]}
              />
              <Bar
                dataKey="value"
                radius={[4, 4, 4, 4]}
                barSize={30}
                fill="url(#barPattern)"
                shape={(props: any) => {
                  const { x, y, width, height } = props;
                  return (
                    <g>
                      <defs>
                        <pattern
                          id="barPattern"
                          patternUnits="userSpaceOnUse"
                          width="4"
                          height="4"
                          patternTransform="rotate(45)"
                        >
                          <line x1="0" y="0" x2="0" y2="4" stroke="#333333" strokeWidth="2" />
                        </pattern>
                      </defs>
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={data[5].month === "Jun" ? "#FF29A8" : "url(#barPattern)"}
                        rx={4}
                        ry={4}
                      />
                    </g>
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}

