import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();


    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    

    const { data, error } = await supabaseAdmin.inviteUserByEmail(email);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 
