import { NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userData, error: userError } = await (await supabase()).auth.getUser(token);
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Get the current origin for redirect URL
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const { data, error } = await supabaseAdmin.inviteUserByEmail(email, {
      redirectTo: `${origin}/set-password`,
    });
    
    if (error) {
      // Check if the error is due to user already existing
      if (error.message.includes('already registered') || error.message.includes('already exists') || error.message.includes('User already registered')) {
        return NextResponse.json({ 
          error: `User ${email} has already been invited or registered.`,
          suggestion: "If they haven't received the email, ask them to check spam folder. If they need a new invite, an admin will need to remove them first, or they can try logging in directly.",
          isExistingUser: true
        }, { status: 409 }); // 409 Conflict for existing user
      }
      
      return NextResponse.json({ 
        error: error.message,
        suggestion: "Please try again or contact support if the issue persists."
      }, { status: 400 });
    }

    return NextResponse.json({ 
      data,
      message: `Invitation sent to ${email}. They will receive an email to set up their account and password.`
    });

  } catch (err: any) {
    return NextResponse.json({ 
      error: `Failed to process invitation: ${err.message}`,
      suggestion: "Please try again or contact support if the issue persists."
    }, { status: 500 });
  }
} 
