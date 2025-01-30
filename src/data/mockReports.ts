type AttackReport = {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  analysis: string;
}

export const mockReports: AttackReport[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    severity: "critical",
    description: "Multiple failed SSH login attempts detected from IP 192.168.1.100",
    analysis: "Potential brute force attack targeting SSH service. IP has been temporarily blocked. Recommend reviewing access logs and implementing rate limiting."
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    severity: "high",
    description: "Unusual outbound traffic spike detected on port 445",
    analysis: "Possible malware activity attempting to spread through SMB protocol. Affected system isolated. Recommend immediate malware scan and network traffic analysis."
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    severity: "medium",
    description: "Multiple 404 errors from web application scanning",
    analysis: "Directory enumeration attempt detected. IP shows pattern consistent with automated vulnerability scanning. Enhanced monitoring implemented."
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    severity: "low",
    description: "SSL certificate expiration warning",
    analysis: "SSL certificate for api.example.com will expire in 30 days. Recommend renewing certificate to prevent service disruption."
  }
]; 
