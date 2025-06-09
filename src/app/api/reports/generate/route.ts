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

    // Available attack types for reference
    const attackTypes = [
      "DDoS", "Phishing", "SQL Injection", "XSS", "Malware Infection", 
      "Ransomware", "Brute Force Attack", "Man-in-the-Middle", 
      "Zero-Day Exploit", "Insider Threat", "Network Scan"
    ];

    // Randomly select a less common attack type occasionally to ensure variety
    const shouldUseUncommonType = Math.random() < 0.4; // 40% chance
    const uncommonTypes = ["Zero-Day Exploit", "Insider Threat", "Man-in-the-Middle", "Network Scan", "XSS"];
    const commonTypes = ["DDoS", "Phishing", "SQL Injection", "Malware Infection", "Ransomware", "Brute Force Attack"];
    
    let typeHint = "";
    if (shouldUseUncommonType) {
      const randomUncommon = uncommonTypes[Math.floor(Math.random() * uncommonTypes.length)];
      typeHint = `Consider generating a ${randomUncommon} attack type to ensure variety in the security reports.`;
    } else {
      const randomCommon = commonTypes[Math.floor(Math.random() * commonTypes.length)];
      typeHint = `Consider generating a ${randomCommon} attack type.`;
    }

    // Generate fake security report data using Gemini
    const { object: reportData } = await generateObject({
      model: google('gemini-2.0-flash-exp'),
      schema: ReportSchema,
      prompt: `Generate a realistic cybersecurity incident report with maximum variety and authenticity.
      
      ${typeHint}
      
      Available attack types: ${attackTypes.join(", ")}
      
      Requirements:
      - Choose ANY attack type from the available options, prioritizing variety over common attacks
      - Create a unique, realistic scenario that could happen in today's threat landscape
      - Include specific technical details, IP addresses, file hashes, and domain names
      - Vary severity levels appropriately (critical should be rare, low/medium more common)
      - Write detailed technical analysis that sounds like a real SOC analyst
      - Include comprehensive step-by-step mitigation procedures
      - Provide realistic confidence score (70-95%)
      - Reference actual CVEs, security frameworks, or tools when applicable
        
      Make this report unique and avoid repetitive patterns. Each report should feel like a completely different security incident.`
    });
    
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
