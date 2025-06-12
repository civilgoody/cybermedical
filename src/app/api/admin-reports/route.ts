import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/server';
import { z } from 'zod';

// Schema for admin report creation
const AdminReportSchema = z.object({
  reports: z.string().min(1, "Report content is required"),
});

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database connection not configured' },
      { status: 500 }
    );
  }

  try {
    const { data, error } = await (await supabase())
      .from('admin_reports')
      .select(`
        *,
        profiles:admin (
          first_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database connection not configured' },
      { status: 500 }
    );
  }

  try {
    // Get user from session
    const { data: { user }, error: authError } = await (await supabase()).auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const parseResult = AdminReportSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid report data', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { reports } = parseResult.data;

    // Insert the admin report
    const { data, error } = await (await supabase())
      .from('admin_reports')
      .insert({
        admin: user.id,
        reports: reports.trim(),
      })
      .select(`
        *,
        profiles:admin (
          first_name
        )
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating admin report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database connection not configured' },
      { status: 500 }
    );
  }

  try {
    // Get user from session
    const { data: { user }, error: authError } = await (await supabase()).auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get report ID from URL search params
    const url = new URL(request.url);
    const reportId = url.searchParams.get('id');

    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }

    // Delete the admin report (with auth check - users can only delete their own reports)
    const { error } = await (await supabase())
      .from('admin_reports')
      .delete()
      .eq('id', reportId)
      .eq('admin', user.id); // Security: users can only delete their own reports

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting admin report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
