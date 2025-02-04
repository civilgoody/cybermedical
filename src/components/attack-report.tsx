import { Card } from "@/components/ui/card"
import { AlertTriangle, Clock, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AttackReportProps {
  timestamp: string
  severity: "Low" | "Medium" | "High"
  description: string
  analysis: string
}

export function AttackReport({ timestamp, severity, description, analysis }: AttackReportProps) {
  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-4 rounded-xl">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-white" />
          <span className="text-white text-base">Attack Report</span>
        </div>
        <Badge variant="outline" className="bg-[#453A00] text-[#FFD700] border-[#453A00] rounded-md px-3 py-0.5">
          {severity}
        </Badge>
      </div>

      <div className="flex items-center gap-2 mb-4 text-[#666666]">
        <Clock className="w-4 h-4" />
        <span className="text-sm">{timestamp}</span>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-[#FF29A8] text-base mb-1">Description</h4>
          <p className="text-white text-sm">{description}</p>
        </div>

        <div>
          <h4 className="text-[#FF29A8] text-base mb-1">AI Analysis</h4>
          <p className="text-white text-sm">{analysis}</p>
        </div>

        <button className="flex items-center gap-1 text-[#666666] text-sm hover:text-[#888888] transition-colors">
          Read more
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </Card>
  )
}

