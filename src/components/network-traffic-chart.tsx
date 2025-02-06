"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// Mock function to simulate real-time data fetching
const fetchPacketData = () => {
  // Simulate random packet data for demonstration
  return Math.floor(Math.random() * 300);
}

export default function WireSharkPacketsChart() {
  const [data, setData] = useState<{ time: string; packets: number }[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newPacketCount = fetchPacketData();
      
      // Update the data state with the new packet count
      setData(prevData => {
        // Limit the data to the last 12 entries (for example)
        const updatedData = [...prevData, { time: currentTime, packets: newPacketCount }];
        return updatedData.length > 12 ? updatedData.slice(1) : updatedData; // Keep only the last 12 entries
      });
    }, 5000); // Fetch new data every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-900/20" />

      <div className="relative">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-semibold text-white">Live WireShark Packets</h3>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1A1A] text-[#666666] hover:text-white transition-colors">
            <span className="text-sm">Time</span>
            <ChevronDown className="w-4 h-4" />
          </button>
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
              <Bar
                dataKey="packets"
                radius={[4, 4, 4, 4]}
                barSize={30}
                fill="#FF29A8"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
