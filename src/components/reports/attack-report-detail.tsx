import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TechnicalAnalysis {
  technical_evaluation: string;
  risk_assessment: string;
  attack_chain: string;
  iocs: string[];
}

interface MitigationSteps {
  immediate: string;
  containment: string;
  eradication: string;
  recovery: string;
  prevention: string;
}

interface AttackReportDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  created_at: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  technical_analysis: TechnicalAnalysis;
  mitigation_steps?: MitigationSteps;
  type:
    | "DDoS"
    | "Phishing"
    | "SQL Injection"
    | "XSS"
    | "Malware Infection"
    | "Ransomware"
    | "Brute Force Attack"
    | "Man-in-the-Middle"
    | "Zero-Day Exploit"
    | "Insider Threat";
}

function formatTechnicalAnalysis(analysis: TechnicalAnalysis): string {
  return `
**Technical Evaluation:**
${analysis.technical_evaluation}

**Risk Assessment:**
${analysis.risk_assessment}

**Attack Chain:**
${analysis.attack_chain}

**Indicators of Compromise:**
${analysis.iocs.join(", ")}
  `;
}

function formatMitigationSteps(mitigation: MitigationSteps): string {
  return `
**Immediate Actions:**
${mitigation.immediate}

**Containment:**
${mitigation.containment}

**Eradication:**
${mitigation.eradication}

**Recovery:**
${mitigation.recovery}

**Prevention:**
${mitigation.prevention}
  `;
}

export function AttackReportDetail({
  open,
  onOpenChange,
  created_at,
  severity,
  description,
  technical_analysis,
  mitigation_steps,
  type,
}: AttackReportDetailProps) {
  // Format the date
  const formattedDate = new Date(created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Capitalize severity for display
  const displaySeverity = severity.charAt(0).toUpperCase() + severity.slice(1);
  // Capitalize threat type for display
  const displayType = type
    ? type.charAt(0).toUpperCase() + type.slice(1)
    : "Unknown";

  const analysisMarkdown = formatTechnicalAnalysis(technical_analysis);
  const mitigationMarkdown = mitigation_steps
    ? formatMitigationSteps(mitigation_steps)
    : "No mitigation steps provided.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border-[#1F1F1F] text-white max-w-3xl max-h-[80vh] py-10 px-0 flex flex-col">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-[#141414] border-b border-[#1F1F1F] px-6 py-4 flex-shrink-0">
          <DialogHeader className="mb-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-white" />
                <DialogTitle className="text-white text-xl">
                  Attack Report
                </DialogTitle>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className="bg-[#1A1A1A] text-[#FF29A8] border-[#FF29A8] rounded-md px-3 py-0.5"
                >
                  {displayType}
                </Badge>
                <Badge
                  variant="outline"
                  color={severity}
                  className="rounded-md px-3 py-0.5"
                >
                  {displaySeverity}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#666666] mt-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{formattedDate}</span>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto overflow-x-hidden custom-scrollbar px-6 mb-2 flex-grow">
          <div className="space-y-8 pb-4">
            <section className="bg-[#1A1A1A] rounded-lg p-5 border border-[#2A2A2A]">
              <h4 className="text-[#FF29A8] text-base font-medium mb-3 flex items-center">
                Description
              </h4>
              <div className="prose prose-invert max-w-none prose-p:text-[#E0E0E0] prose-headings:text-white">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {description}
                </ReactMarkdown>
              </div>
            </section>

            <section className="bg-[#1A1A1A] rounded-lg p-5 border border-[#2A2A2A]">
              <h4 className="text-[#FF29A8] text-base font-medium mb-3 flex items-center">
                AI Analysis
              </h4>
              <div className="prose prose-invert max-w-none prose-p:text-[#E0E0E0] prose-headings:text-white prose-strong:text-[#FF29A8]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {analysisMarkdown}
                </ReactMarkdown>
              </div>
            </section>

            <section className="bg-[#1A1A1A] rounded-lg p-5 border border-[#2A2A2A]">
              <h4 className="text-[#FF29A8] text-base font-medium mb-3 flex items-center">
                Mitigation
              </h4>
              <div className="prose prose-invert max-w-none prose-p:text-[#E0E0E0] prose-headings:text-white prose-strong:text-[#FF29A8]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {mitigationMarkdown}
                </ReactMarkdown>
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
