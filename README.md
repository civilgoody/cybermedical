# Cyber AI Attack Report System

A real-time security monitoring and reporting system that processes server attacks through AI analysis and displays them in an interactive web interface. The system uses server-side AI processing to analyze attacks and sends the processed reports to this web application for visualization.

## System Overview

This system consists of three main components:
1. Server-side attack detection and monitoring
2. Server-side AI analysis of attack patterns
3. Vite-powered web interface for attack visualization and reporting

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
- AI-generated analysis (processed on the server)
- Visual indicators and badges for quick assessment

## Setup and Configuration

### Prerequisites
- Bun (Latest version)
- Vite
- TypeScript
- Connection to the attack analysis server

### Installation
```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Preview production build
bun preview
```

### Environment Variables
Create a `.env` file in the root directory with:
```
# Server endpoint where the AI-processed attack reports are fetched from
VITE_API_ENDPOINT=your_server_endpoint_here
```

## Security Considerations

1. **Server Communication**
   - Ensure secure communication with the analysis server
   - Implement proper authentication mechanisms
   - Use HTTPS for all API communications

2. **Attack Data Handling**
   - Reports are displayed with appropriate access controls
   - Sensitive information is properly sanitized before display
   - Implement proper data validation for incoming reports

3. **Real-time Monitoring**
   - System provides immediate notifications for critical attacks
   - Attack patterns are displayed in real-time
   - Historical data is maintained for trend analysis

## Development Guidelines

1. **Adding New Features**
   - Follow the existing component structure
   - Maintain type safety with TypeScript
   - Use the provided UI components for consistency

2. **Testing**
   - Write tests for new features
   - Test across different severity levels
   - Verify proper display of AI analysis from server

3. **Performance**
   - Optimize for real-time updates
   - Implement proper error handling
   - Monitor system resource usage

## Troubleshooting

Common issues and solutions:
1. Server Connection Issues
   - Verify API endpoint configuration
   - Check network connectivity
   - Confirm server status and authentication

2. Report Display Problems
   - Clear browser cache
   - Check for JavaScript console errors
   - Verify data format consistency

## Support and Maintenance

For support:
1. Check the documentation first
2. Review system logs
3. Contact the security team for critical issues
4. Monitor report processing accuracy

## License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.
