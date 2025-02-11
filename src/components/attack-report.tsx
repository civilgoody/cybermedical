import { Card } from "@/components/ui/card"
import { AlertTriangle, Clock, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { AttackReportDetail } from "./attack-report-detail"

interface AttackReportProps {
  created_at: string
  severity: "low" | "medium" | "high" | "critical"
  type: "DDoS" | "Phishing" | "SQL Injection" | "XSS" | "Malware Infection" | "Ransomware" | "Brute Force Attack" | "Man-in-the-Middle" | "Zero-Day Exploit" | "Insider Threat"
  description: string
  analysis: string
  mitigation?: string
}

export function AttackReport({ created_at, severity, type, description, analysis, mitigation }: AttackReportProps) {
  const [showDetail, setShowDetail] = useState(false);

  // Format the date
  const formattedDate = new Date(created_at).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  // Capitalize severity for display
  const displaySeverity = severity.charAt(0).toUpperCase() + severity.slice(1);
  // Capitalize threat type for display
  const displayType = type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Unknown';

  return (
    <>
      <Card className="bg-[#141414] border-[#1F1F1F] p-4 rounded-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-white" />
            <span className="text-white text-base">Attack Report</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-[#1A1A1A] text-[#FF29A8] border-[#FF29A8] rounded-md px-3 py-0.5">
              {displayType}
            </Badge>
            <Badge variant="outline" className="bg-[#453A00] text-[#FFD700] border-[#453A00] rounded-md px-3 py-0.5">
              {displaySeverity}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 text-[#666666]">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{formattedDate}</span>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-[#FF29A8] text-base mb-1">Description</h4>
            <p className="text-white text-sm line-clamp-1">{description}</p>
          </div>

          <div>
            <h4 className="text-[#FF29A8] text-base mb-1">AI Analysis</h4>
            <p className="text-white text-sm line-clamp-3">{analysis}</p>
          </div>

          <button
            onClick={() => setShowDetail(true)}
            className="flex items-center gap-1 text-[#666666] text-sm hover:text-[#888888] transition-colors"
          >
            Read more
          <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </Card>

      <AttackReportDetail
        open={showDetail}
        onOpenChange={setShowDetail}
        created_at={created_at}
        severity={severity}
        type={type}
        description={description}
        analysis={analysis}
        mitigation={mitigation}
      />
    </>
  )
}

