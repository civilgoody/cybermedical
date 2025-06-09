"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'sonner';
import { LoadingScreen } from '@/components/ui/loading-spinner';

export default function SetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState<boolean | null>(null);
  
  const router = useRouter();

  // Check if we have valid tokens from the invite link
  useEffect(() => {
    const checkTokens = async () => {
      // Supabase auth tokens come in the URL fragment (#), not query parameters (?)
      const hash = window.location.hash.substring(1); // Remove the # 
      const params = new URLSearchParams(hash);
      
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      
      if (!accessToken || !refreshToken) {
        setValidToken(false);
        toast.error("Invalid invitation link", {
          description: "Please request a new invitation from an administrator.",
        });
        return;
      }

      try {
        // Set the session using the tokens from the URL
        const { error } = await supabase().auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setValidToken(false);
          toast.error("Invalid or expired invitation", {
            description: "Please request a new invitation from an administrator.",
          });
        } else {
          setValidToken(true);
          // Clear the URL fragment for security
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (error) {
        setValidToken(false);
        toast.error("Error processing invitation", {
          description: "Please try again or request a new invitation.",
        });
      }
    };

    checkTokens();
  }, []); // Remove searchParams dependency since we're reading from fragment

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase().auth.updateUser({
        password: password,
      });

      if (error) {
        toast.error("Failed to set password", {
          description: error.message,
        });
      } else {
        toast.success("Password set successfully! Redirecting to dashboard...");
        
        // Clear URL parameters and redirect to home
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (error: any) {
      toast.error("Failed to set password", {
        description: error.message || "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (validToken === null) {
    return <LoadingScreen message="Validating invitation..." />;
  }

  if (validToken === false) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <Card className="bg-[#141414] border-[#1F1F1F] p-8 w-full max-w-md">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-white">Invalid Invitation</h1>
            <p className="text-[#999999]">
              This invitation link is invalid or has expired. Please contact an administrator to request a new invitation.
            </p>
            <Button
              onClick={() => router.push('/')}
              className="w-full bg-[#1A1A1A] hover:bg-[#242424] text-white border border-[#333333]"
            >
              Go to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Set Your Password</h1>
          <p className="text-[#999999] text-lg">
            Welcome! Please set a secure password for your admin account.
          </p>
        </div>

        {/* Password Setup Form */}
        <Card className="bg-[#141414] border-[#1F1F1F] p-8">
          <form onSubmit={handleSetPassword} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#cccccc]">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="bg-[#1A1A1A] border-[#333333] text-white placeholder:text-[#666666] focus-visible:ring-primary pr-12 h-12"
                  disabled={loading}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#666666] hover:text-primary transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#cccccc]">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="bg-[#1A1A1A] border-[#333333] text-white placeholder:text-[#666666] focus-visible:ring-primary pr-12 h-12"
                  disabled={loading}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#666666] hover:text-primary transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Strength Indicators */}
            <div className="space-y-2">
              <p className="text-sm text-[#cccccc]">Password requirements:</p>
              <div className="space-y-1">
                <div className={`flex items-center gap-2 text-sm ${password.length >= 6 ? 'text-green-400' : 'text-[#666666]'}`}>
                  <Check className={`w-3 h-3 ${password.length >= 6 ? 'text-green-400' : 'text-[#666666]'}`} />
                  At least 6 characters
                </div>
                <div className={`flex items-center gap-2 text-sm ${password === confirmPassword && password.length > 0 ? 'text-green-400' : 'text-[#666666]'}`}>
                  <Check className={`w-3 h-3 ${password === confirmPassword && password.length > 0 ? 'text-green-400' : 'text-[#666666]'}`} />
                  Passwords match
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading || password !== confirmPassword || password.length < 6}
              className="w-full bg-primary hover:bg-primary/90 text-white h-12"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin" />
                  Setting Password...
                </div>
              ) : (
                'Set Password & Continue'
              )}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-sm text-[#666666]">
            After setting your password, you'll be redirected to the admin dashboard
          </p>
        </div>
      </div>
    </div>
  );
} 
