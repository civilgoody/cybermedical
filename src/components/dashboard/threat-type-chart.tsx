"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { MoreVertical } from "lucide-react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartData } from "chart.js"
import { useThreatTypes } from "@/hooks/use-dashboard-data"
import { SkeletonDoughnutChart } from "@/components/ui/skeleton"

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS: Record<string, string> = {
  "Malware Infection": "#8B5CF6",
  "Phishing": "#FF29A8",
  "DDoS": "#6EE7B7",
  "SQL Injection": "#4CAF50",
  "XSS": "#FFC107",
  "Ransomware": "#FF5722",
  "Brute Force Attack": "#2196F3",
  "Man-in-the-Middle": "#9C27B0",
  "Zero-Day Exploit": "#607D8B",
  "Insider Threat": "#795548",
  "Network Scan": "#009688",
  "Unknown": "#666666" // Fallback for unknown threat types
}

export default function ThreatTypeChart() {
  const { data, isLoading, error } = useThreatTypes()

  // Process data for chart
  const chartData: ChartData<"doughnut"> = React.useMemo(() => {
    if (!data || data.topThreats.length === 0) {
      return {
        datasets: [{
          data: [1],
          backgroundColor: ['#333333'],
          borderWidth: 0,
          spacing: 2
        }],
        labels: ['No data']
      }
    }

    const labels = data.topThreats.map(([type]) => type)
    const chartValues = data.topThreats.map(([, count]) => count)
    const backgroundColor = labels.map(type => COLORS[type] || '#666666')

    return {
      datasets: [{
        data: chartValues,
        backgroundColor,
        borderWidth: 0,
        spacing: 2
      }],
      labels
    }
  }, [data])

  const threatCounts = React.useMemo(() => {
    return data ? Object.fromEntries(data.topThreats) : {}
  }, [data])

  if (isLoading) {
    return <SkeletonDoughnutChart />;
  }

  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-4 sm:p-6 rounded-xl h-[350px] sm:h-[400px] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-900/20" />
      <div className="relative">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white">Threat Type</h3>
          <button className="text-[#666666] hover:text-[#888888] transition-colors">
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Chart Container */}
        <div className="relative h-[160px] sm:h-[220px]">
          {error ? (
            <div className="flex items-center justify-center h-full text-red-400">
              Error loading data
            </div>
          ) : (
            <>
              <Doughnut
                data={chartData}
                options={{
                  cutout: "75%",
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      enabled: true,
                      backgroundColor: "#1A1A1A",
                      titleColor: "#fff",
                      bodyColor: "#fff",
                      borderWidth: 0,
                      cornerRadius: 8,
                      displayColors: true,
                      titleFont: { size: 12 },
                      bodyFont: { size: 11 },
                      callbacks: {
                        label: (context) => {
                          const value = context.raw as number;
                          const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                          const percentage = ((value * 100) / total).toFixed(1);
                          return `${value} (${percentage}%)`;
                        }
                      }
                    },
                  },
                  maintainAspectRatio: false,
                }}
                className="h-4"
              />
              {/* Center Count */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{data?.totalThreats || 0}</div>
                  <div className="text-xs sm:text-sm text-[#666666]">Total Threats</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Custom Legend placed BELOW the chart container */}
        {!error && (
          <div className="mt-4 sm:mt-6 flex justify-center gap-2 sm:gap-4 flex-wrap max-h-[60px] sm:max-h-[80px] overflow-y-auto custom-scrollbar">
            {Object.entries(threatCounts).map(([type, count]) => (
              <div key={type} className="flex items-center gap-1 sm:gap-2 bg-[#1A1A1A] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: COLORS[type] || '#666666' }}
                />
                <span className="text-xs text-white truncate max-w-[80px] sm:max-w-none">{type}</span>
                <span 
                  className="text-xs ml-1" 
                  style={{ color: COLORS[type] || '#666666' }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

