import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface AttackReportDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  created_at: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  analysis: string
  mitigation?: string
  type: "DDoS" | "Phishing" | "SQL Injection" | "XSS" | "Malware Infection" | "Ransomware" | "Brute Force Attack" | "Man-in-the-Middle" | "Zero-Day Exploit" | "Insider Threat"
}

export function AttackReportDetail({
  open,
  onOpenChange,
  created_at,
  severity,
  description,
  analysis,
  mitigation,
  type
}: AttackReportDetailProps) {
  // Format the date
  const formattedDate = new Date(created_at).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })

  // Capitalize severity for display
  const displaySeverity = severity.charAt(0).toUpperCase() + severity.slice(1)
  // Capitalize threat type for display
  const displayType = type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Unknown'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border-[#1F1F1F] text-white max-w-2xl max-h-[85vh] overflow-hidden pt-10">
        <DialogHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">

              <AlertTriangle className="w-5 h-5 text-white" />
              <DialogTitle className="text-white text-xl">Attack Report</DialogTitle>
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
          <div className="flex items-center gap-2 text-[#666666] mb-6">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{formattedDate}</span>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto custom-scrollbar pr-4 space-y-6">
          <div>
            <h4 className="text-[#FF29A8] text-base mb-3">Description</h4>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {description}
              </ReactMarkdown>
            </div>
          </div>

          <div>
            <h4 className="text-[#FF29A8] text-base mb-3">AI Analysis</h4>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysis}
              </ReactMarkdown>
            </div>
          </div>
          <div>
            <h4 className="text-[#FF29A8] text-base mb-3">Mitigation</h4>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {mitigation || 'No mitigation steps provided.'}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
