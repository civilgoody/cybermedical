import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { supabase } from '@/utils/supabase/server';

// Your existing schema
const ReportSchema = z.object({
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
    "Insider Threat",
    "Network Scan"
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
  try {
    // Optional: Add simple auth check
    const authHeader = request.headers.get('authorization');
    if (process.env.API_KEY && authHeader !== `Bearer ${process.env.API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate fake security report data using Gemini
    const { object: reportData } = await generateObject({
      model: google('gemini-2.0-flash-exp'),
      schema: ReportSchema,
      prompt: `Generate a realistic cybersecurity incident report. Include:
        - A random attack type from the available options
        - Appropriate severity level
        - Detailed technical analysis with realistic IOCs
        - Comprehensive mitigation steps
        - Confidence score as percentage
        - Relevant security references/CVEs
        
        Make it sound like a real security incident that could happen today.`
    });
    console.log(reportData);
    
    // Use admin client to insert into database
    
    const { data, error } = await (await supabase()).from('attack_reports')
      .insert({
        type: reportData.type,
        severity: reportData.severity,
        description: reportData.description,
        technical_analysis: reportData.technical_analysis,
        mitigation_steps: reportData.mitigation_steps,
        confidence_score: reportData.confidence_score,
        references: reportData.references,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Report generated and saved successfully',
      report: data 
    });
    
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
