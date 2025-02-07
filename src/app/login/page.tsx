'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '@/utils/supabase/client';

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase().auth.getSession();
      if (session) {
        setTimeout(() => {
          router.replace('/');
        }, 100);
      } else {
        setIsLoading(false);
      }
    }
    checkSession();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return isLoading ?
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-10 h-10 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
    </div>
    :
    (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background border-border p-8 rounded-xl">


        <h1 className="text-2xl font-bold text-foreground mb-6 text-center">Sign In</h1>

        
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-3 rounded-md hover:bg-gray-100 transition-colors"
        >
          <FcGoogle className="w-5 h-5" />
          <span>Sign in with Google</span>
        </button>
      </Card>
    </div>
  ) 
} 
