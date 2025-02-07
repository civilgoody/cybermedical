# Cyber AI Attack Report System

A real-time security monitoring and reporting system that processes server attacks through AI analysis and displays them in an interactive web interface. The system receives attack reports from the security server, processes them through the Next.js API routes, and displays them in real-time.

## System Overview

This system consists of three main components:
1. External security server for attack detection and monitoring
2. Next.js API routes for receiving and processing attack reports
3. Next.js frontend for attack visualization and reporting

## Attack Severity Levels

The system categorizes attacks into four severity levels:

| Level | Description | Visual Indicator |
|-------|-------------|------------------|
| Critical | Immediate attention required. Potential severe system compromise. | Red badge with AlertOctagon icon |
| High | Serious security threat requiring prompt action. | Orange badge with AlertTriangle icon |
| Medium | Moderate risk requiring investigation. | Yellow badge with AlertTriangle icon |
| Low | Minor security event requiring monitoring. | Green badge with Shield icon |

## Attack Report Structure

Each attack report contains:
- Timestamp of the attack
- Severity level
- Description of the attack
- AI-generated analysis (received from security server)
- Visual indicators and badges for quick assessment

## Setup and Configuration

### Prerequisites
- Node.js (Latest LTS version)
- Next.js 14+
- TypeScript
- Connection to the security server

### Installation
```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Start production server
bun start
```

### Environment Variables
Create a `.env.local` file in the root directory with:
```
# Security server endpoint where the attack reports are received from
SECURITY_SERVER_ENDPOINT=your_security_server_url

# Optional: Security server authentication token
SECURITY_SERVER_TOKEN=your_auth_token
```

## API Routes

The application uses Next.js API routes to handle attack reports:

```typescript
// POST /api/reports
// Receives attack reports from the security server
POST /api/reports

// GET /api/reports
// Retrieves processed attack reports with pagination
GET /api/reports?page=1&limit=10

// GET /api/reports/critical
// Retrieves only critical severity reports
GET /api/reports/critical
```

## Security Considerations

1. **API Security**
   - Implement authentication for API routes
   - Validate incoming report data
   - Use environment variables for sensitive data

2. **Attack Data Handling**
   - Reports are stored securely in the database
   - Access controls for different severity levels
   - Data sanitization before display

3. **Real-time Monitoring**
   - Server-sent events for real-time updates
   - Immediate notifications for critical attacks
   - Historical data persistence

## Development Guidelines

1. **Adding New Features**
   - Follow Next.js best practices
   - Maintain type safety with TypeScript
   - Use provided UI components for consistency

2. **Testing**
   - Write API route tests
   - Test real-time updates
   - Verify report processing logic

3. **Performance**
   - Implement proper caching
   - Optimize API responses
   - Monitor server resource usage

## Troubleshooting

Common issues and solutions:
1. API Connection Issues
   - Check API route configurations
   - Verify security server connectivity
   - Review authentication tokens

2. Report Display Problems
   - Check client-side state management
   - Verify WebSocket connections
   - Debug real-time update issues

## Support and Maintenance

For support:
1. Check the documentation first
2. Review application logs
3. Contact the security team for critical issues
4. Monitor report processing accuracy

## License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.

## Tasks
1. Pagination and refresh button for the reports
2. Profile Page
3. 2FA
4. Wirepackets
