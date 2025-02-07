import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/utils/supabase/server';
import { z } from 'zod';
import type { Database } from '@/types/supabase';

// Define a Zod schema for validating the report payload
const ReportSchema = z.object({
  severity: z.enum(["low", "medium", "high", "critical"]),
  description: z.string(),
  analysis: z.string(),
  type: z.enum([
    "DDoS",
    "Phishing",
    "SQL Injection",
    "XSS",
    "Malware Infection",
    "Ransomware",
    "Brute Force Attack",
    "Man-in-the-Middle",
    "Zero-Day Exploit",
    "Insider Threat"
  ])
});

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database connection not configured' },
      { status: 500 }
    );
  }

  try {
    // Parse the request body
    const body = await request.json();
    // Validate using Zod; if it fails, return a 400 response with details
    const parseResult = ReportSchema.safeParse(body);
    if (!parseResult.success) {
      console.error("Validation error", parseResult.error);
      return NextResponse.json(
        { error: "Invalid report data", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }
    const report = parseResult.data;

    // Insert the validated data into your database. The created_at value is auto-generated.
    const { data, error } = await (await supabase()).from('attack_reports')
      .insert({
        severity: report.severity,
        description: report.description,
        analysis: report.analysis,
        type: report.type,
        created_at: new Date().toISOString(), // Explicit timestamp
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
