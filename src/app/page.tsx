"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import Dashboard from "@/components/dashboard/dashboard";
import Login from "@/components/auth/login";

export default function Home() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check the current session status
        const { data: { session } } = await supabase().auth.getSession();
        
        if (mounted) {
          setAuthenticated(!!session);
          setIsInitializing(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setAuthenticated(false);
          setIsInitializing(false);
        }
      }
    };

    // Listen for auth state changes
    const { data: authListener } = supabase().auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        const isAuthenticated = !!session;
        setAuthenticated(isAuthenticated);
        
        // Only set initializing to false after the auth state change is processed
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          setIsInitializing(false);
        }
        
        // Invalidate all user-related queries when auth state changes
        if (event === 'SIGNED_IN') {
          // User just signed in - invalidate all queries to fetch fresh data
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: queryKeys.user.current }),
            queryClient.invalidateQueries({ queryKey: ['profile'] }),
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
            queryClient.invalidateQueries({ queryKey: queryKeys.mfa.all }),
          ]);
        } else if (event === 'SIGNED_OUT') {
          // User signed out - clear all queries
          queryClient.clear();
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  // Show loading while initializing or when auth state is null
  if (isInitializing || authenticated === null) {
    return <LoadingScreen message="Initializing..." />;
  }

  return authenticated ? <Dashboard /> : <Login />;
}

