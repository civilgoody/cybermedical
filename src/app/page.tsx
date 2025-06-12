"use client";

import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import Dashboard from "@/components/dashboard/dashboard";
import Login from "@/components/auth/login";
import { useProfile } from "@/hooks/use-profile";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoading } = useProfile();

  // Fix hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!isMounted || isLoading) {
    return <LoadingScreen message="Loading dashboard..." />;
  }

  // Show login if no user
  if (!user) {
    return <Login />;
  }

  // User is authenticated, show dashboard
  return <Dashboard />;
}

