import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/server';
import type { Database } from '@/types/supabase';

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database connection not configured' },
      { status: 500 }
    );
  }

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

    // Insert into Supabase using admin client
    const { data, error } = await (await supabase()).from('attack_reports')

      .insert({
        severity: report.severity,
        description: report.description,
        analysis: report.analysis,
        created_at: new Date().toISOString(), // Explicitly set the timestamp
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
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database connection not configured' },
      { status: 500 }

    );
  }

  try {
    const { data, error } = await (await supabase()).from('attack_reports')
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
