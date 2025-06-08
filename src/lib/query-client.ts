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

// Query keys for consistency
export const queryKeys = {
  dashboard: {
    all: ['dashboard'] as const,
    reports: () => [...queryKeys.dashboard.all, 'reports'] as const,
    attackFrequency: (timeframe: string) => [...queryKeys.dashboard.all, 'attack-frequency', timeframe] as const,
    severityBreakdown: (timeframe: string) => [...queryKeys.dashboard.all, 'severity-breakdown', timeframe] as const,
    threatTypes: () => [...queryKeys.dashboard.all, 'threat-types'] as const,
  },
} as const 
