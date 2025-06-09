"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import Dashboard from "@/components/dashboard/dashboard";
import Login from "@/components/auth/login";

export default function Home() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check the current session status.
    supabase().auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
    });

    // Listen for auth state changes.
    const { data: authListener } = supabase().auth.onAuthStateChange(
      (event, session) => {
        const isAuthenticated = !!session;
        setAuthenticated(isAuthenticated);
        
        // Invalidate all user-related queries when auth state changes
        if (event === 'SIGNED_IN') {
          // User just signed in - invalidate all queries to fetch fresh data
          queryClient.invalidateQueries({ queryKey: queryKeys.user.current });
          queryClient.invalidateQueries({ queryKey: ['profile'] }); // Invalidate any profile queries
          queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.mfa.all });
        } else if (event === 'SIGNED_OUT') {
          // User signed out - clear all queries
          queryClient.clear();
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, [queryClient]);

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading…
      </div>
    );
  }

  return authenticated ? <Dashboard /> : <Login />;
}

