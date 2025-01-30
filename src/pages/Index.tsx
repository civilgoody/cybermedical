import { useState, useEffect } from "react";
import AttackReport from "@/components/AttackReport";

// Temporary mock data for demonstration
const mockReports = [
  {
    id: 1,
    timestamp: new Date().toLocaleString(),
    severity: "critical" as const,
    description: "SQL Injection attempt detected on authentication endpoint",
    analysis: "High-risk attack pattern identified. The attempt used known SQLi vectors targeting user authentication. Recommended: Review input validation and implement prepared statements.",
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 3600000).toLocaleString(),
    severity: "medium" as const,
    description: "Multiple failed login attempts detected",
    analysis: "Potential brute force attack. IP address has been temporarily blocked. Consider implementing rate limiting if not already in place.",
  },
];

const Index = () => {
  const [reports, setReports] = useState(mockReports);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Security Monitor</h1>
          <p className="text-muted-foreground">Real-time attack analysis and reporting</p>
        </div>
        
        <div className="grid gap-6">
          {reports.map((report) => (
            <AttackReport
              key={report.id}
              timestamp={report.timestamp}
              severity={report.severity}
              description={report.description}
              analysis={report.analysis}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;