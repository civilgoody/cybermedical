import { Card } from "@/components/ui/card"
import { MoreVertical } from "lucide-react"
import { AttackReport } from "./attack-report"

const SAMPLE_REPORTS = [
  {
    timestamp: "Jan 31, 2025, 12:40 PM",
    severity: "Medium",
    description: "Security alert detected",
    analysis:
      "**Severity: Medium** **Brief description: An application layer protocol mismatch was detected between the source and destination IP addresses.** **Detailed analysis:** The...",
  },
  {
    timestamp: "Jan 31, 2025, 12:40 PM",
    severity: "Medium",
    description: "Security alert detected",
    analysis:
      "**Severity:** Low **Brief description:** A TLS connection attempt was made with an invalid record type. **Detailed analysis:** The Suricata intrusion detection",
  },
] as const

export function ThreatReportSection() {
  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-4 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">AI Threat Report</h2>
        <button className="text-[#666666] hover:text-[#888888] transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
        {SAMPLE_REPORTS.map((report, index) => (
          <AttackReport key={index} {...report} />
        ))}
      </div>
    </Card>
  )
}

