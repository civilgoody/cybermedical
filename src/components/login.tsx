"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import { X } from "lucide-react";

export default function Login() {
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check for error parameters in the URL on mount
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get("error");
    const errorCode = searchParams.get("error_code");

    if (error && errorCode) {
      // Map error codes to user-friendly messages
      const errorMessages: { [key: string]: string } = {
        signup_disabled: "This is a private application. Please contact an administrator for access.",
        access_denied: "Access denied. Please try again or contact support if the issue persists.",
      };

      setErrorMessage(errorMessages[errorCode] || "An error occurred during sign in. Please try again.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setErrorMessage(""); // Clear any existing errors
      const { error } = await supabase().auth.signInWithOAuth({
        provider: "google"
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setErrorMessage("Unable to connect to Google. Please try again.");
    }
  };

  // Clear error message and remove error query parameters from URL
  const clearError = () => {
    setErrorMessage("");
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {errorMessage && (
          <div className="mb-6 bg-red-950/50 border border-red-900 rounded-lg p-4">
            <div className="flex justify-between items-center text-red-400">
              <span>{errorMessage}</span>
              <button
                onClick={clearError}
                className="p-1 hover:text-red-300 transition-colors rounded-lg hover:bg-red-900/50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mb-8 flex justify-center">
          <div className="p-3 rounded-full border border-purple-500/20">
            <Image src="/cyber-logo.png" alt="Cyber Logo" width={64} height={64} />
          </div>
        </div>
        
        <Card className="bg-[#141414] border-[#1F1F1F] p-8 rounded-xl">
          <h1 className="text-2xl font-bold text-white mb-2 text-center">Welcome Back</h1>
          <p className="text-[#666666] text-center mb-8">Sign in to continue to Cyber AI</p>
          
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-[#1A1A1A] text-white py-4 rounded-lg hover:bg-[#242424] transition-colors border border-[#1F1F1F]"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>
        </Card>
      </div>
    </div>
  );
} 
