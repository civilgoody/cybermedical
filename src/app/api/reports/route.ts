import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

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

    // Insert into Supabase
    const { data, error } = await supabase
      .from('attack_reports')
      .insert({
        severity: report.severity,
        description: report.description,
        analysis: report.analysis,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error processing report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('attack_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
