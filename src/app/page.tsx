"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import Dashboard from "@/components/dashboard";
import Login from "@/components/login";


export default function Home() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check the current session status.
    supabase().auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
    });

    // Listen for auth state changes.
    const { data: authListener } = supabase().auth.onAuthStateChange(
      (_, session) => {
        setAuthenticated(!!session);
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading…
      </div>
    );
  }

  return authenticated ? <Dashboard /> : <Login />;
}

