import { NextResponse } from 'next/server';

// In-memory storage for reports
let reports: Array<{
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  analysis: string;
}> = [];

export async function POST(request: Request) {
  try {
    const report = await request.json();
    
    // Validate required fields
    if (!report.severity || !report.description || !report.analysis) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate severity level
    if (!['low', 'medium', 'high', 'critical'].includes(report.severity)) {
      return NextResponse.json(
        { error: 'Invalid severity level' },
        { status: 400 }
      );
    }

    // Add metadata
    const newReport = {
      ...report,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    // Store report
    reports.unshift(newReport); // Add to start of array
    reports = reports.slice(0, 100); // Keep only latest 100 reports

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error('Error processing report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(reports);
} 
