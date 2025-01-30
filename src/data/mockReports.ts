import type { AttackReport } from '@/types/reports';

export const mockReports: AttackReport[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    severity: 'high',
    description: 'Multiple failed SSH login attempts detected from IP 192.168.1.100',
    analysis: 'Pattern suggests a brute force attack targeting SSH service. Source IP has been flagged for suspicious activity across multiple time windows. Recommended actions: 1) Block the source IP, 2) Review SSH configuration, 3) Implement rate limiting.'
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    severity: 'critical',
    description: 'Unusual data exfiltration detected on port 443',
    analysis: 'Large volume of encrypted traffic detected to unknown external endpoints. Traffic patterns indicate potential data exfiltration attempt. High priority investigation required. Immediate actions: 1) Isolate affected system, 2) Block suspicious IPs, 3) Initiate incident response protocol.'
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    severity: 'medium',
    description: 'Anomalous process behavior detected on web server',
    analysis: 'Web server process exhibiting unusual memory and CPU patterns. Possible memory leak or resource exhaustion attack. Recommended actions: 1) Review process logs, 2) Monitor resource usage, 3) Update web server security patches.'
  }
]; 
