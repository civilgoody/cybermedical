import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes default
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false, // Prevent refetch on window focus
      refetchOnReconnect: false, // Prevent refetch on reconnect
      refetchInterval: false, // Disable automatic polling by default
    },
    mutations: {
      retry: 1,
    },
  },
})

// Query configuration presets to reduce repetition
export const queryConfigs = {
  // For data that rarely changes (user info, profile)
  stable: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false as const,
  },
  
  // For dashboard data that updates more frequently
  dashboard: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true, // Do refetch on reconnect for dashboard
    refetchInterval: 2 * 60 * 1000, // Poll every 2 minutes
  },
  
  // For real-time data that should refresh often
  realtime: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 60 * 1000, // Poll every minute
  },
}

// Query keys for consistency
export const queryKeys = {
  dashboard: {
    all: ['dashboard'] as const,
    reports: () => [...queryKeys.dashboard.all, 'reports'] as const,
    attackFrequency: (timeframe: string) => [...queryKeys.dashboard.all, 'attack-frequency', timeframe] as const,
    severityBreakdown: (timeframe: string) => [...queryKeys.dashboard.all, 'severity-breakdown', timeframe] as const,
    threatTypes: () => [...queryKeys.dashboard.all, 'threat-types'] as const,
  },
  user: {
    current: ['user'] as const,
    profile: (userId: string) => ['profile', userId] as const,
  },
} as const 
