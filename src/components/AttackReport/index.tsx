'use client';

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
  low: { color: 'bg-green-500/20 text-green-500 border-green-500/50', icon: Shield },
  medium: { color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50', icon: AlertTriangle },
  high: { color: 'bg-orange-500/20 text-orange-500 border-orange-500/50', icon: AlertTriangle },
  critical: { color: 'bg-red-500/20 text-red-500 border-red-500/50', icon: AlertOctagon },
};

const AttackReport = ({ timestamp, severity, description, analysis }: AttackReportProps) => {
  const { color, icon: Icon } = severityConfig[severity];
  
  return (
    <Card className="attack-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color.split(' ')[1]}`} />
          <span className="text-green-400/80">Attack Report</span>
        </CardTitle>
        <Badge variant="outline" className={`${color} border`}>
          {severity.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-green-300/60 mb-4">
          <Clock className="mr-2 h-4 w-4" />
          {timestamp}
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-green-400 mb-2">Description</h4>
            <p className="text-sm text-green-300/80">{description}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-400 mb-2">AI Analysis</h4>
            <p className="text-sm text-green-300/80">{analysis}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttackReport; 
