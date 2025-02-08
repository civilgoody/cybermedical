"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function AuthCodeError() {
  const router = useRouter();

  const handleRetry = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="max-w-md p-8 bg-background rounded-xl border border-border text-white">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
          <h1 className="text-xl font-bold">Authentication Error</h1>
        </div>
        <p className="mb-6">
          An error occurred while processing your authentication code. Please try signing in again.
        </p>
        <button
          onClick={handleRetry}
          className="w-full py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/80 transition-colors"
        >
          Go back to Sign In
        </button>
      </Card>
    </div>
  );
}

