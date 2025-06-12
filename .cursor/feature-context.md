# Feature Context Tracker

This document tracks features, their related files, and implementation details to prevent context loss and ensure comprehensive updates.

## 🔥 Authentication System

### Core Files
- `src/app/page.tsx` - Main auth initialization and state management
- `src/hooks/use-profile.ts` - Profile management with auth integration
- `src/components/layout/header.tsx` - Auth state display and navigation
- `src/components/auth/login.tsx` - Login component
- `src/components/dashboard/dashboard.tsx` - Protected dashboard route

### Auth State Listeners
```typescript
// Pattern used across multiple files:
const { data: authListener } = supabase().auth.onAuthStateChange((event, session) => {
  // Handle auth state changes
})

// Always clean up:
return () => authListener.subscription.unsubscribe()
```

### Configuration
- Auth settings in Supabase dashboard
- JWT settings in `supabase/config.toml`

---

## ⚡ Data Refresh System

### Current Status: **SIMPLIFIED POLLING APPROACH**
**Strategy**: 3-minute auto-refresh + manual refresh button

### Implementation Details
- **Auto-refresh**: Every 3 minutes
- **Manual refresh**: Button in dashboard header
- **Window focus**: Refresh when user returns to app
- **Network reconnect**: Refresh on connection restore
- **No background polling**: Saves resources when tab not active

### Core Files
- `src/hooks/use-dashboard-data.ts` - **MAIN DATA HOOK** with polling
- `src/lib/query-client.ts` - Query configurations optimized for polling
- `src/components/dashboard/dashboard.tsx` - Manual refresh button

### Manual Refresh Implementation
```typescript
// In use-dashboard-data.ts
export const useRefreshDashboard = () => {
  const queryClient = useQueryClient()
  
  const refresh = () => {
    console.log('🔄 Manual dashboard refresh triggered')
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
  }

  return refresh
}

// In dashboard component
const refreshDashboard = useRefreshDashboard()
<Button onClick={refreshDashboard}>Refresh</Button>
```

### Query Configuration
```typescript
dashboard: {
  staleTime: 1 * 60 * 1000, // 1 minute (fresh data)
  refetchInterval: 3 * 60 * 1000, // Poll every 3 minutes
  refetchOnWindowFocus: true, // Refresh when user returns
  refetchOnReconnect: true, // Refresh on network reconnect
}
```

---

## 📊 Dashboard Data Flow

### Core Files
- `src/hooks/use-dashboard-data.ts` - Main data fetching and processing
- `src/components/dashboard/dashboard.tsx` - Main dashboard layout with refresh button
- `src/components/reports/threat-report-section.tsx` - Reports display
- `src/components/dashboard/attack-frequency-chart.tsx` - Attack frequency visualization
- `src/components/dashboard/severity-breakdown-chart.tsx` - Severity analysis
- `src/components/dashboard/threat-type-chart.tsx` - Threat type distribution

### Data Processing Hooks
```typescript
// Derived hooks that depend on main dashboard data:
export const useReports = () => // Latest 50 reports
export const useAttackFrequency = (timeframe) => // Processed hourly data
export const useSeverityBreakdown = (timeframe) => // Severity analysis
export const useThreatTypes = () => // Threat type counts
export const useRefreshDashboard = () => // Manual refresh function
```

### Database Schema
- Table: `attack_reports`
- Fields: `id`, `type`, `severity`, `description`, `technical_analysis`, `mitigation_steps`, `created_at`

---

## 🔄 TanStack Query Integration

### Core Files
- `src/lib/query-client.ts` - Query client configuration and presets
- All hook files using `useQuery`, `useMutation`

### Query Configurations
```typescript
// Stable data (user, profile): 5 min stale time, no polling
// Dashboard data: 1 min stale time, 3 min polling
```

### Query Keys Structure
```typescript
queryKeys = {
  dashboard: {
    all: ['dashboard'],
    reports: () => [...queryKeys.dashboard.all, 'reports'],
    frequency: (timeframe) => [...queryKeys.dashboard.all, 'frequency', timeframe],
    severity: (timeframe) => [...queryKeys.dashboard.all, 'severity', timeframe],
    threats: () => [...queryKeys.dashboard.all, 'threats'],
  },
  user: ['user'], 
  profile: (userId) => ['profile', userId],
  mfa: ['mfa']
}
```

---

## 🤖 AI Report Generation

### Core Files
- `src/app/api/reports/generate/route.ts` - Main generation endpoint
- `.github/workflows/daily-reports.yml` - Scheduled generation
- `src/app/api/reports/route.ts` - CRUD operations

### Configuration
- Random count generation (1-10 reports)
- Gemini AI integration
- Attack type variety logic
- Timing variation for realism

---

## 🔐 Profile Management

### Core Files
- `src/hooks/use-profile.ts` - Profile state management
- Components that use profile data

### Features
- Automatic profile initialization
- Profile updates with optimistic UI
- Integration with auth system

---

## 🔒 Multi-Factor Authentication

### Core Files
- `src/hooks/use-mfa.ts` - MFA state and operations
- MFA-related components

---

## 📝 Update Checklist

When modifying any feature, check these related areas:

### Authentication Changes
- [ ] `src/app/page.tsx` - Main auth flow
- [ ] `src/hooks/use-profile.ts` - Profile auth integration  
- [ ] `src/components/layout/header.tsx` - Auth display
- [ ] All `onAuthStateChange` listeners

### Data Refresh Changes
- [ ] `src/hooks/use-dashboard-data.ts` - Main data logic and refresh function
- [ ] `src/components/dashboard/dashboard.tsx` - Refresh button
- [ ] All derived dashboard hooks
- [ ] Query configurations in `src/lib/query-client.ts`

### Query Configuration Changes
- [ ] `src/lib/query-client.ts` - Global settings
- [ ] All hooks using query configs
- [ ] Stale time and polling intervals
- [ ] Window focus/reconnect behavior

### Dashboard Data Changes
- [ ] Database schema modifications
- [ ] API route updates
- [ ] All chart components
- [ ] Data processing functions

---

## 🔍 Debugging Patterns

### Auth Issues
```typescript
// Add to auth listeners:
console.log('Auth event:', event, 'Session:', !!session)
```

### Data Refresh Issues
```typescript
// Add to queries:
console.log('Query status:', { isLoading, error, data })
console.log('🔄 Manual dashboard refresh triggered')
```

### Query Issues
```typescript
// Add to queries:
console.log('Query status:', { isLoading, error, data })
```

---

## 🚀 Performance Considerations

### Authentication
- JWT refresh handling
- Session persistence
- Auth state synchronization

### Data Refresh
- 3-minute polling interval balances freshness vs. performance
- Manual refresh for immediate updates
- Window focus refresh for better UX
- No background polling saves resources

### Queries
- Stale time optimization
- Cache invalidation strategies
- Background refetching
- Query deduplication

---

## 📚 External Dependencies

### Supabase Services
- Database (PostgreSQL)
- Authentication
- ~~Realtime~~ (removed for simplicity)
- Storage (if used)

### AI Services  
- Google Gemini API

### State Management
- TanStack Query
- React state

### UI Framework
- Tailwind CSS
- Custom components
- Lucide React icons
