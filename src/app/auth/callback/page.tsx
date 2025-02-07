'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase().auth.getSession();
        if (error) throw error;

        if (session?.user) {
          // Create or update user record in users table
          const { error: dbError } = await supabase()
            .from('users')
            .upsert({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata.name || session.user.email?.split('@')[0],
              avatar_url: session.user.user_metadata.avatar_url,
              last_sign_in: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });

          if (dbError) throw dbError;
        }
        
        // Redirect to the dashboard after successful authentication
        router.push('/');
        router.refresh();
      } catch (error) {
        console.error('Error during auth callback:', error);
        router.push('/auth/signin');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Completing sign in...</div>
    </div>
  );
} 
