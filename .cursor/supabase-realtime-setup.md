# Supabase Realtime Setup Guide

This guide ensures proper configuration of Supabase Realtime for both local development and production environments.

## 📋 Prerequisites Checklist

### Local Development
- [x] `realtime.enabled = true` in `supabase/config.toml`
- [ ] Table replication enabled
- [ ] RLS policies configured
- [ ] Test realtime subscription

### Production Environment
- [ ] Realtime enabled in Supabase dashboard
- [ ] Table publications configured
- [ ] RLS policies deployed
- [ ] Database triggers (if needed)

## 🔧 Local Development Setup

### 1. Verify Configuration
Your `supabase/config.toml` should have:
```toml
[realtime]
enabled = true
```
✅ Already configured in your project.

### 2. Enable Table Replication
Run these SQL commands in your local Supabase:

```sql
-- Check existing publications
SELECT * FROM pg_publication;

-- Add attack_reports table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE attack_reports;

-- Verify table is added
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

### 3. Configure Row Level Security
Ensure RLS is properly set up:

```sql
-- Enable RLS (if not already enabled)
ALTER TABLE attack_reports ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view all reports
CREATE POLICY "Users can view all attack reports" 
ON attack_reports FOR SELECT 
TO authenticated 
USING (true);

-- Allow anonymous users to view reports (for public dashboard)
CREATE POLICY "Anonymous users can view attack reports" 
ON attack_reports FOR SELECT 
TO anon 
USING (true);
```

### 4. Test Local Realtime
Run this test in your browser console:

```javascript
// Connect to local Supabase
const { createClient } = supabase
const supabaseClient = createClient(
  'http://127.0.0.1:54321',
  'your-anon-key'
)

// Test subscription
const channel = supabaseClient
  .channel('test-channel')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'attack_reports'
  }, (payload) => {
    console.log('Test payload received:', payload)
  })
  .subscribe((status) => {
    console.log('Subscription status:', status)
  })

// Test insert
supabaseClient.from('attack_reports').insert({
  type: 'DDoS',
  severity: 'low',
  description: 'Test realtime update'
})
```

## 🚀 Production Setup

### 1. Enable Realtime in Dashboard
1. Go to your Supabase project dashboard
2. Navigate to `Settings > API`
3. Scroll to `Real-time` section
4. Toggle ON for your database

### 2. Configure Table Publications
In the Supabase dashboard SQL editor:

```sql
-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE attack_reports;

-- Verify publication
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

### 3. Deploy RLS Policies
Run the same RLS commands as local development.

### 4. Test Production Realtime
Update your frontend to use production keys and test.

## 🔍 Troubleshooting Guide

### Common Issues & Solutions

#### Issue: "subscription timed out"
**Cause**: Connection timeout on free tier
**Solution**: 
- Implement reconnection logic (✅ already implemented)
- Add heartbeat mechanism (✅ already implemented)
- Use polling as fallback (✅ already implemented)

#### Issue: "channel error"
**Cause**: Invalid channel configuration or RLS blocking
**Solution**:
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'attack_reports';

-- Test policy as anon user
SET ROLE anon;
SELECT * FROM attack_reports LIMIT 1;
RESET ROLE;
```

#### Issue: "rate limit exceeded"
**Cause**: Too many messages per second
**Free tier limit**: 100 messages/second
**Solution**: Implement message throttling or upgrade plan

#### Issue: "subscription limit exceeded" 
**Cause**: Too many concurrent subscriptions
**Free tier limit**: 200 concurrent connections
**Solution**: 
- Consolidate subscriptions
- Use single subscription for multiple events
- Implement connection pooling

### Debug Commands

```sql
-- Check realtime configuration
SELECT * FROM pg_stat_replication;

-- Check publication tables
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- Check active connections
SELECT * FROM pg_stat_activity 
WHERE application_name LIKE '%realtime%';

-- Monitor realtime messages
SELECT * FROM realtime.messages ORDER BY inserted_at DESC LIMIT 10;
```

## 📊 Monitoring & Performance

### Key Metrics to Watch
- Connection count vs. free tier limit (200)
- Messages per second vs. limit (100)
- Reconnection frequency
- Subscription success rate

### Performance Optimization
1. **Minimize subscriptions**: Use single subscription for multiple events
2. **Filter at database level**: Use RLS and filters to reduce message volume
3. **Batch updates**: Group related changes together
4. **Implement backoff**: Use exponential backoff for reconnections

### Logging Setup
Your realtime manager already includes comprehensive logging:
- Connection status changes
- Heartbeat signals
- Reconnection attempts
- Error conditions

Monitor these logs during development and production.

## 🔄 Migration Checklist

When deploying to production:

- [ ] Run local realtime tests
- [ ] Deploy database migrations with RLS policies
- [ ] Configure production realtime settings
- [ ] Test production realtime connection
- [ ] Monitor connection stability
- [ ] Verify fallback polling works
- [ ] Test reconnection scenarios

## 🆘 Emergency Procedures

### If Realtime Completely Fails
Your app already has automatic fallback:
1. Realtime manager detects failures
2. After 5 failed reconnection attempts
3. Switches to 30-second polling
4. App continues functioning normally

### Manual Fallback Activation
```typescript
// Force enable polling fallback
queryClient.setQueryDefaults(queryKeys.dashboard.all, {
  refetchInterval: 30 * 1000, // Poll every 30 seconds
})
```

## 📚 Additional Resources

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Supabase Realtime Quotas](https://supabase.com/docs/guides/realtime/quotas)
- [Postgres Changes Guide](https://supabase.com/docs/guides/realtime/postgres-changes)
- [RLS Performance Guide](https://supabase.com/docs/guides/database/postgres/row-level-security#rls-performance-recommendations) 
