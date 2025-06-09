# Demo Setup Guide

This guide will help you set up the portfolio demo functionality for your cybersecurity dashboard.

## Demo Features

✅ **One-Click Demo Access** - Prominent "Try Demo" button on login page  
✅ **Real-time Data** - Works with your existing cron job for AI-generated reports  
✅ **Full Feature Access** - Demo user can test all functionality including 2FA and admin features  
✅ **Clear Demo Indicators** - Visual indicators show when in demo mode  
✅ **Multiple Auth Options** - Keep existing Google auth alongside demo login  

## Setup Steps

### Option 1: Automated Script (Recommended)

1. **Get your Supabase Service Role Key**:
   - Go to your Supabase project settings
   - Navigate to API section
   - Copy the `service_role` key (not the `anon` key)

2. **Set environment variables**:
   ```bash
   export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
   # NEXT_PUBLIC_SUPABASE_URL should already be set
   ```

3. **Run the setup script**:
   ```bash
   node scripts/create-demo-user.js
   ```

### Option 2: Manual Setup via Supabase Dashboard

1. **Create Demo User in Supabase Auth**:
   - Go to your Supabase project → Authentication → Users
   - Click "Add user" 
   - **Email**: `demo@cybersecurity-portfolio.com`
   - **Password**: `DemoUser2024!`
   - **Auto Confirm User**: ✅ Yes
   - Click "Create user"

2. **Copy the User ID**:
   - After creating the user, copy their UUID from the users table
   - You'll need this for the next step

3. **Run Database Setup**:
   - Go to your Supabase project → SQL Editor
   - Replace `YOUR_DEMO_USER_UUID_HERE` in the script below with the actual UUID
   - Run this SQL:

```sql
-- Replace 'YOUR_DEMO_USER_UUID_HERE' with the actual UUID from step 2
INSERT INTO profiles (
  id,
  first_name,
  last_name,
  bio,
  country,
  city,
  post_code,
  phone,
  role
) VALUES (
  'YOUR_DEMO_USER_UUID_HERE', -- Replace with actual demo user UUID
  'Demo',
  'User',
  'Portfolio demonstration account for cybersecurity dashboard showcase',
  'United States',
  'San Francisco',
  '94102',
  '+1 (555) 123-4567',
  'admin'
) ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  bio = EXCLUDED.bio,
  country = EXCLUDED.country,
  city = EXCLUDED.city,
  post_code = EXCLUDED.post_code,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role;

-- Insert sample admin reports
INSERT INTO admin_reports (admin, reports, created_at) VALUES 
(
  'YOUR_DEMO_USER_UUID_HERE', -- Replace with actual demo user UUID
  'Quarterly Security Assessment: Implemented new firewall rules and updated intrusion detection systems. Network traffic analysis shows 15% reduction in suspicious activities. All critical vulnerabilities patched successfully.',
  NOW() - INTERVAL '2 hours'
),
(
  'YOUR_DEMO_USER_UUID_HERE', -- Replace with actual demo user UUID  
  'Emergency Response: Detected and mitigated DDoS attack targeting main servers. Implemented rate limiting and blacklisted malicious IP ranges. Service restoration completed within 30 minutes.',
  NOW() - INTERVAL '1 day'
),
(
  'YOUR_DEMO_USER_UUID_HERE', -- Replace with actual demo user UUID
  'Monthly Threat Intelligence Update: Identified 3 new threat vectors through AI analysis. Updated threat signature database and deployed countermeasures. Training scheduled for security team.',
  NOW() - INTERVAL '3 days'
);
```

### 4. Enable 2FA for Demo User

**Important**: For the full demo experience, log in as the demo user and enable 2FA:

1. Login with demo credentials
2. Go to Profile page
3. Enable MFA (use any authenticator app)
4. Save the TOTP secret for demo purposes

This allows demo users to test the admin invite functionality.

## Demo User Experience

### Login Page Features
- **Prominent Demo Button**: Large, eye-catching "Try Demo Now" button
- **Multiple Login Options**: Email/password, Google OAuth, and demo access
- **Clear Branding**: Portfolio demonstration messaging

### Demo Mode Indicators
- **Visual Badge**: "Demo Mode" indicator in top-right corner
- **User Context**: Demo user shows as "Demo User" throughout the app
- **Profile Information**: Clearly marked as demo account

### Full Feature Access
Demo users can test:
- ✅ Real-time dashboard with live attack data
- ✅ All chart interactions and timeframe selections
- ✅ Profile editing and management
- ✅ 2FA setup and verification
- ✅ Admin report creation and management
- ✅ Admin user invitation (with 2FA)
- ✅ All security features and monitoring tools

## Deployment Considerations

### Environment Variables
No additional environment variables needed - demo works with existing Supabase configuration.

### Vercel Deployment
- ✅ Real-time features work perfectly on Vercel
- ✅ WebSocket connections handled client-side
- ✅ No server-side state management needed

### Security
- Demo user has limited scope (clear demo email domain)
- Real users can still use Google auth
- Demo data is clearly marked and isolated

## Portfolio Benefits

### For Recruiters/Employers
- **Immediate Access**: No signup friction
- **Full Experience**: See all features in action
- **Real-time Demo**: Live data updates and interactions
- **Professional Presentation**: Clear demo indicators maintain credibility

### For Technical Assessment
- **Code Quality**: Clean authentication implementation
- **Architecture**: Proper separation of demo and production features
- **User Experience**: Thoughtful onboarding and clear visual indicators
- **Real-time Capabilities**: Demonstrates WebSocket integration and live updates

## Maintenance

### Demo Data
- Your existing cron job continues generating attack reports
- Demo user sees the same real-time data as regular users
- No additional data maintenance required

### Updates
- Demo functionality uses the same codebase as production
- Updates to features automatically apply to demo mode
- No separate demo environment to maintain

## Troubleshooting

### Demo Login Issues
1. Verify demo user exists in Supabase Auth → Users
2. Check email/password match exactly: `demo@cybersecurity-portfolio.com` / `DemoUser2024!`
3. Ensure user email is confirmed in Supabase dashboard

### Missing Demo Data
1. Verify SQL script was run with correct user UUID
2. Check profiles and admin_reports tables in Supabase
3. Ensure proper permissions are set

### 2FA Problems
1. Demo user must enable 2FA through the UI after first login
2. Use any standard authenticator app (Google Authenticator, Authy, etc.)
3. Save TOTP secret for testing admin invites

## Next Steps

1. ✅ Choose setup method (automated script or manual)
2. ✅ Create the demo user following steps above
3. ✅ Test the demo functionality locally
4. ✅ Deploy to your portfolio hosting (Vercel recommended)
5. ✅ Share the live demo link with potential employers

Your cybersecurity dashboard is now ready for portfolio showcase! 🚀 
 