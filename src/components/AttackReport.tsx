import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Shield, AlertTriangle, AlertOctagon } from "lucide-react";

interface AttackReportProps {
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  analysis: string;
}

const severityConfig = {
  low: { color: 'bg-green-500/20 text-green-500', icon: Shield },
  medium: { color: 'bg-yellow-500/20 text-yellow-500', icon: AlertTriangle },
  high: { color: 'bg-orange-500/20 text-orange-500', icon: AlertTriangle },
  critical: { color: 'bg-red-500/20 text-red-500', icon: AlertOctagon },
};

function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoString;
  }
}

const AttackReport = ({ timestamp, severity, description, analysis }: AttackReportProps) => {
  const { color, icon: Icon } = severityConfig[severity];
  
  return (
    <Card className="attack-card fade-in border-border/50 bg-secondary/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            Attack Report
          </div>
        </CardTitle>
        <Badge variant="outline" className={color}>
          {severity.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Clock className="mr-2 h-4 w-4" />
          <span suppressHydrationWarning>{formatTimestamp(timestamp)}</span>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-primary mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-primary mb-2">AI Analysis</h4>
            <p className="text-sm text-muted-foreground">{analysis}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttackReport;
