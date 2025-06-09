import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { supabase } from '@/utils/supabase/client'
import { queryKeys, queryConfigs } from '@/lib/query-client'
import { ThreatType } from '@/types/supabase'

// Types
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

export interface Report {
  id?: string;
  created_at: string;
  severity: "low" | "medium" | "high" | "critical";
  type: ThreatType;
  description: string;
  technical_analysis: TechnicalAnalysis;
  mitigation_steps?: MitigationSteps;
}

// Single source of truth - fetch all dashboard data once
const fetchDashboardData = async (): Promise<Report[]> => {
  const { data, error } = await supabase()
    .from('attack_reports')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Helper functions to process data
const processAttackFrequency = (reports: Report[], timeframe: '24h' | '7d' | '30d') => {
  const now = new Date()
  let startTime: Date
  
  switch (timeframe) {
    case '7d':
      startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    default:
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  }

  // Filter reports by timeframe
  const filteredReports = reports.filter(report => 
    new Date(report.created_at) >= startTime
  )

  // Process into hourly data
  const hourlyData = new Map<number, { label: string; count: number }>()
  
  filteredReports.forEach(report => {
    const date = new Date(report.created_at)
    const timestamp = Math.floor(date.getTime() / (60 * 60 * 1000)) * (60 * 60 * 1000)
    const label = date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric' 
    })
    
    const entry = hourlyData.get(timestamp) || { label, count: 0 }
    entry.count++
    hourlyData.set(timestamp, entry)
  })

  return Array.from(hourlyData.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([_, { label, count }]) => ({ hour: label, count }))
}

const processSeverityBreakdown = (reports: Report[], timeframe: '24h' | '7d' | '30d') => {
  const now = new Date()
  let startTime: Date
  
  switch (timeframe) {
    case '7d':
      startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    default:
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  }

  // Filter reports by timeframe
  const filteredReports = reports.filter(report => 
    new Date(report.created_at) >= startTime
  )

  // Process into time buckets with severity counts
  const timeData = new Map<number, { 
    label: string; 
    low: number; 
    medium: number; 
    high: number; 
    critical: number; 
  }>()
  
  filteredReports.forEach(report => {
    const date = new Date(report.created_at)
    const timestamp = Math.floor(date.getTime() / (60 * 60 * 1000)) * (60 * 60 * 1000)
    const label = date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric' 
    })
    
    if (!timeData.has(timestamp)) {
      timeData.set(timestamp, { label, low: 0, medium: 0, high: 0, critical: 0 })
    }
    
    const bucket = timeData.get(timestamp)!
    const severity = report.severity as "low" | "medium" | "high" | "critical"
    bucket[severity]++
  })

  return Array.from(timeData.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([_, values]) => values)
}

const processThreatTypes = (reports: Report[]) => {
  // Count threats by type
  const counts: Record<string, number> = {}
  reports.forEach(report => {
    const threatType = report.type ? (report.type as ThreatType) : "Unknown"
    counts[threatType] = (counts[threatType] || 0) + 1
  })

  return {
    counts,
    totalThreats: reports.length,
    topThreats: Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
  }
}

// Track subscription channels per query client to prevent conflicts
const subscriptionChannels = new WeakMap<any, any>()

// Main hook for all dashboard data
export const useDashboardData = () => {
  const queryClient = useQueryClient()
  
  const query = useQuery({
    queryKey: queryKeys.dashboard.all,
    queryFn: fetchDashboardData,
    ...queryConfigs.dashboard, // Use dashboard config preset
  })

  // Set up real-time subscription once per query client instance
  useEffect(() => {
    // Check if we already have a subscription for this query client
    if (subscriptionChannels.has(queryClient)) return
    
    const channel = supabase()
      .channel('dashboard-reports')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attack_reports'
        },
        (payload) => {
          console.log('Real-time update:', payload)
          // Invalidate the main dashboard query - all derived queries will update automatically
          queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
        }
      )
      .subscribe()

    // Store the channel reference
    subscriptionChannels.set(queryClient, channel)

    return () => {
      // Clean up the subscription when effect runs again or component unmounts
      const storedChannel = subscriptionChannels.get(queryClient)
      if (storedChannel) {
        supabase().removeChannel(storedChannel)
        subscriptionChannels.delete(queryClient)
      }
    }
  }, [queryClient])

  return query
}

// Derived hooks that use the main dashboard data
export const useReports = () => {
  const { data: allReports, isLoading, error } = useDashboardData()
  
  // Take only the most recent 50 reports for the reports section
  const reports = useMemo(() => {
    if (!allReports || !Array.isArray(allReports)) return []
    return allReports.slice(0, 50)
  }, [allReports])
  
  return { data: reports, isLoading, error }
}

export const useAttackFrequency = (timeframe: '24h' | '7d' | '30d') => {
  const { data: allReports, isLoading, error } = useDashboardData()
  
  const processedData = useMemo(() => {
    if (!allReports || !Array.isArray(allReports) || allReports.length === 0) return []
    return processAttackFrequency(allReports, timeframe)
  }, [allReports, timeframe])
  
  return { data: processedData, isLoading, error }
}

export const useSeverityBreakdown = (timeframe: '24h' | '7d' | '30d') => {
  const { data: allReports, isLoading, error } = useDashboardData()
  
  const processedData = useMemo(() => {
    if (!allReports || !Array.isArray(allReports) || allReports.length === 0) return []
    return processSeverityBreakdown(allReports, timeframe)
  }, [allReports, timeframe])
  
  return { data: processedData, isLoading, error }
}

export const useThreatTypes = () => {
  const { data: allReports, isLoading, error } = useDashboardData()
  
  const processedData = useMemo(() => {
    if (!allReports || !Array.isArray(allReports) || allReports.length === 0) {
      return { counts: {}, totalThreats: 0, topThreats: [] }
    }
    return processThreatTypes(allReports)
  }, [allReports])
  
  return { data: processedData, isLoading, error }
} 
 