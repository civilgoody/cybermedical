import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
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

// Fetch data via API route instead of direct Supabase calls
const fetchDashboardData = async (): Promise<Report[]> => {
  console.log('📊 Fetching dashboard data via API...');
  
  try {
    const response = await fetch('/api/reports', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Prevent caching to ensure fresh data
      cache: 'no-store'
    });

    console.log('📡 API response status:', response.status);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Dashboard data fetched successfully via API:', { count: data?.length || 0 });
    
    return data || [];
  } catch (err) {
    console.error('💥 Dashboard API fetch threw exception:', err);
    throw err;
  }
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

// Main hook for all dashboard data
export const useDashboardData = () => {
  console.log('🎯 useDashboardData hook called');
  
  const query = useQuery({
    queryKey: queryKeys.dashboard.all,
    queryFn: fetchDashboardData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes  
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchInterval: 3 * 60 * 1000, // Poll every 3 minutes
  })

  console.log('📈 Dashboard query state:', { 
    isLoading: query.isLoading, 
    isError: query.isError, 
    dataLength: query.data?.length,
    error: query.error
  });

  return query
}

// Manual refresh function with loading state
export const useRefreshDashboard = () => {
  const queryClient = useQueryClient()
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const refresh = async () => {
    if (isRefreshing) return // Prevent multiple simultaneous refreshes
    
    console.log('🔄 Manual dashboard refresh triggered')
    setIsRefreshing(true)
    
    try {
      // Force refetch the data immediately
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
        queryClient.refetchQueries({ queryKey: queryKeys.dashboard.all })
      ])
      
      console.log('✅ Dashboard refresh completed')
    } catch (error) {
      console.error('❌ Dashboard refresh failed:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return { refresh, isRefreshing }
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
 