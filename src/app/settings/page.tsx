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

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <MFASection />
      <InviteSection />
    </div>
  );
} 
