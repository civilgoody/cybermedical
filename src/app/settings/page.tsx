"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/use-profile";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import MFASection from "@/components/auth/mfa-section";
import InviteSection from "@/components/auth/invite-section";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading } = useProfile();

  // Handle redirect in useEffect to avoid render errors
  useEffect(() => {
    if (!isLoading && !user) {
        router.push("/");
    }
  }, [isLoading, user, router]);

  // Show loading while checking auth or redirecting
  if (isLoading || (!isLoading && !user)) {
    return <LoadingScreen message="Loading settings..." />;
  }

  return (
    <div className="min-h-screen bg-black p-8 px-32">
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>
      <div className="max-w-3xl space-y-6">
        <MFASection />
        <InviteSection />
      </div>
    </div>
  );
} 
