"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import MFASection from "@/components/mfa-section";
import InviteSection from "@/components/invite-section";

export default function SettingsPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  // On mount, check for an active session.
  useEffect(() => {
    async function fetchSession() {
      const {
        data: { session },
      } = await supabase().auth.getSession();
      if (!session) {
        router.push("/");
      } else {
        setSession(session);
      }
    }
    fetchSession();
  }, [router]);

  if (!session) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="w-10 h-10 border-t-2 border-b-2 border-white rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8 px-32">
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>
      <div className="max-w-3xl">
        <MFASection />
        <InviteSection />
      </div>
    </div>
  );
} 
