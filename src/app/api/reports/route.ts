import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/utils/supabase/server';
import { z } from 'zod';
import type { Database } from '@/types/supabase';

// Define a Zod schema for validating the new report payload
const ReportSchema = z.object({
  alert: z.enum([
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
  ]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  description: z.string(),
  technical_analysis: z.object({
    technical_evaluation: z.string(),
    risk_assessment: z.string(),
    attack_chain: z.string(),
    iocs: z.array(z.string())
  }),
  mitigation_steps: z.object({
    immediate: z.string(),
    containment: z.string(),
    eradication: z.string(),
    recovery: z.string(),
    prevention: z.string()
  }),
  confidence_score: z.string(),
  references: z.array(z.string())
});

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database connection not configured' },
      { status: 500 }
    );
  }
  
  try {
    // Parse and validate the request body with the new schema
    const body = await request.json();
    const parseResult = ReportSchema.safeParse(body);
    if (!parseResult.success) {
      console.error("Validation error", parseResult.error);
      return NextResponse.json(
        { error: "Invalid report data", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }
    const report = parseResult.data;
    
    // Insert the validated data into the database.
    const { data, error } = await (await supabase()).from('attack_reports')
      .insert({
        alert: report.alert,
        severity: report.severity,
        description: report.description,
        technical_analysis: report.technical_analysis,
        mitigation_steps: report.mitigation_steps,
        confidence_score: report.confidence_score,
        references: report.references,
        created_at: new Date().toISOString() // Explicit timestamp
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
