export interface AttackReport {
  id: string;
  created_at: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  type: string;
  analysis: string;
} 
