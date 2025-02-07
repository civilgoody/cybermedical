export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ThreatType =
  | "DDoS"
  | "Phishing"
  | "SQL Injection"
  | "XSS"
  | "Malware Infection"
  | "Ransomware"
  | "Brute Force Attack"
  | "Man-in-the-Middle"
  | "Zero-Day Exploit"
  | "Insider Threat"

export interface Database {
  public: {
    Tables: {
      attack_reports: {
        Row: {
          id: string
          created_at: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          description: string
          analysis: string
          type: ThreatType
        }
        Insert: {
          id?: string
          created_at?: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          description: string
          analysis: string
          type: ThreatType
        }
        Update: {
          id?: string
          created_at?: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
          description?: string
          analysis?: string
          type?: ThreatType
        }
      }
    }
  }
} 
