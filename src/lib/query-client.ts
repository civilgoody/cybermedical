import { QueryClient } from '@tanstack/react-query'

// Default configuration for all queries
const queryConfigs = {
  defaultOptions: {
    queries: {
      // Global defaults
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retryDelay: (attemptIndex: number) => Math.min(2000 * 2 ** attemptIndex, 30000),
    },
  },
}

// Create the query client
export const queryClient = new QueryClient(queryConfigs)

// Configuration exports
export { queryConfigs }

// Query key factory to maintain consistency - fixed circular reference
const dashboardBase = ['dashboard'] as const
const adminReportsBase = ['admin-reports'] as const

export const queryKeys = {
  // Dashboard queries
  dashboard: {
    all: dashboardBase,
    reports: () => [...dashboardBase, 'reports'] as const,
    frequency: (timeframe: string) => [...dashboardBase, 'frequency', timeframe] as const,
    severity: (timeframe: string) => [...dashboardBase, 'severity', timeframe] as const,
    threats: () => [...dashboardBase, 'threats'] as const,
  },
  
  // Admin reports queries
  adminReports: {
    all: adminReportsBase,
    byUser: (userId: string) => [...adminReportsBase, 'user', userId] as const,
  },
  
  // User and profile queries (maintaining backward compatibility)
  user: {
    current: ['user'] as const,
  },
  profile: (userId: string) => ['profile', userId] as const,
  
  // MFA queries (maintaining backward compatibility)
  mfa: {
    all: ['mfa'] as const,
    factors: () => [['mfa'], 'factors'] as const,
  },
} as const 
 