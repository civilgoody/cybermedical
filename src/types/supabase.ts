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

export type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  bio: string | null
  city: string | null
  country: string | null
  post_code: string | null
  role: 'user' | 'admin'
  updated_at: string
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
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
