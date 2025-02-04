import { Card } from "@/components/ui/card"
import { MoreVertical } from "lucide-react"
import { AttackReport } from "./attack-report"

// Add more sample reports to ensure scrolling
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
  {
    timestamp: "Jan 31, 2025, 12:35 PM",
    severity: "High",
    description: "Multiple failed authentication attempts",
    analysis:
      "**Severity: High** **Brief description:** Multiple failed login attempts detected from suspicious IP. **Detailed analysis:** Potential brute force attack detected...",
  },
  {
    timestamp: "Jan 31, 2025, 12:30 PM",
    severity: "Low",
    description: "Unusual network traffic pattern",
    analysis:
      "**Severity: Low** **Brief description:** Unusual outbound traffic detected on non-standard port. **Detailed analysis:** Traffic analysis shows...",
  },
  {
    timestamp: "Jan 31, 2025, 12:25 PM",
    severity: "Medium",
    description: "Configuration change detected",
    analysis:
      "**Severity: Medium** **Brief description:** Unexpected system configuration modification detected. **Detailed analysis:** System logs indicate...",
  }
] as const

export function ThreatReportSection() {
  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-4 rounded-xl flex flex-col h-[800px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">AI Threat Report</h2>
        <button className="text-[#666666] hover:text-[#888888] transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
        <div className="space-y-4">
          {SAMPLE_REPORTS.map((report, index) => (
            <AttackReport key={index} {...report} />
          ))}
        </div>
      </div>
    </Card>
  )
}

