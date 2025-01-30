export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
        }
        Insert: {
          id?: string
          created_at?: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          description: string
          analysis: string
        }
        Update: {
          id?: string
          created_at?: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
          description?: string
          analysis?: string
        }
      }
    }
  }
} 
