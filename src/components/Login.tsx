"use client";

import { Card } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";

export default function Login() {
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase().auth.signInWithOAuth({
        provider: "google"
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <div className="p-3 rounded-full border border-purple-500/20">
          <Image src="/cyber-logo.png" alt="Cyber Logo" width={64} height={64} />
        </div>
      </div>
      
      <Card className="w-full max-w-md bg-[#141414] border-[#1F1F1F] p-8 rounded-xl">
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
  );
} 
