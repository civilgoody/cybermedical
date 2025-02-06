"use client"

import { Card } from "@/components/ui/card"
import { MoreVertical } from "lucide-react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartData } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

const data: ChartData<"doughnut"> = {
  datasets: [
    {
      data: [82, 46, 10],
      backgroundColor: ["#8B5CF6", "#FF29A8", "#6EE7B7"],
      borderWidth: 0,
      spacing: 2
    },
  ],
  labels: ["Malware", "Phishing", "DDoS"],
}

const options = {
  cutout: "75%",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  maintainAspectRatio: false,
}

export default function ThreatTypeChart() {
  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl h-[320px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Threat Type</h3>
        <button className="text-[#666666] hover:text-[#888888] transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="relative h-[200px] pb-8">
        <Doughnut data={data} options={options} className="h-4" />
        {/* Center count */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">138</div>
            <div className="text-sm text-[#666666]">Total Threats</div>
          </div>
        </div>

        {/* Custom Legend */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
            <span className="text-sm text-white">Malware</span>
            <span className="text-sm text-[#8B5CF6] ml-1">82</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF29A8]" />
            <span className="text-sm text-white">Phishing</span>
            <span className="text-sm text-[#FF29A8] ml-1">46</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#6EE7B7]" />
            <span className="text-sm text-white">DDoS</span>
            <span className="text-sm text-[#6EE7B7] ml-1">10</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

