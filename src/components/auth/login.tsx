"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Play, User } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { toast } from 'sonner';
import { DEMO_USER_EMAIL, DEMO_USER_PASSWORD } from '@/lib/constants';
import { useProfile } from '@/hooks/use-profile';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [demoAuthLoading, setDemoAuthLoading] = useState(false);
  
  // Get user state to know when authentication is complete
  const { user, isLoading: profileLoading } = useProfile();

  // Handle URL error parameters on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get('error');
    const errorCode = searchParams.get('error_code');

    if (error && errorCode) {
      // Map error codes to user-friendly messages
      const errorMessages: { [key: string]: string } = {
        signup_disabled: "This is a private admin application. Please use the demo account or contact an administrator for access.",
        access_denied: "Access denied. Please use the demo account or contact support if the issue persists.",
      };

      const message = errorMessages[errorCode] || "An error occurred during sign in. Please try again.";
      
      toast.error("Sign Up Not Allowed", {
        description: message,
        duration: 8000, // Longer duration for important messages
      });
      
      // Clean up URL without causing page reload
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const { error } = await supabase().auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Login Failed", {
          description: error.message,
        });
        setAuthLoading(false); // Only clear loading on error
      }
      // Don't clear loading on success - let useProfile handle it
    } catch (error) {
      toast.error("Login Failed", {
        description: "An unexpected error occurred",
      });
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    
    try {
      const { error } = await supabase().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast.error("Google Login Failed", {
          description: error.message,
        });
        setAuthLoading(false);
      }
      // Don't clear loading on success - let redirect handle it
    } catch (error) {
      toast.error("Google Login Failed", {
        description: "An unexpected error occurred",
      });
      setAuthLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoAuthLoading(true);

    try {
      const { error } = await supabase().auth.signInWithPassword({
        email: DEMO_USER_EMAIL,
        password: DEMO_USER_PASSWORD,
      });

      if (error) {
        toast.error("Demo Login Failed", {
          description: "Please try again or contact support.",
        });
        setDemoAuthLoading(false); // Only clear loading on error
      }
      // Don't clear loading on success - let useProfile handle it
    } catch (error) {
      toast.error("Demo Login Failed", {
        description: "An unexpected error occurred",
      });
      setDemoAuthLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_USER_EMAIL);
    setPassword(DEMO_USER_PASSWORD);
    toast.success("Demo credentials filled in");
  };

  // Clear auth loading states when user is authenticated
  useEffect(() => {
    if (user) {
      setAuthLoading(false);
      setDemoAuthLoading(false);
    }
  }, [user]);

  // Combined loading state - show loading if any auth operation is in progress OR profile is loading
  const isLoading = authLoading || demoAuthLoading /*|| profileLoading*/;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Cyber Security Dashboard</h1>
          <p className="text-[#999999] text-lg">Real-time attack monitoring and AI analysis</p>
        </div>

        {/* Demo Button - Most Prominent */}
        <Card className="bg-gradient-to-r from-primary/20 to-purple-600/20 border-primary/30 p-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-3 py-1">
                Portfolio Demo
              </Badge>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white">Try the Live Demo</h3>
              <p className="text-[#cccccc] leading-relaxed">
                Experience the full dashboard with real-time attack data, AI analysis, and admin features
              </p>
            </div>
            <Button 
              onClick={handleDemoLogin}
              disabled={isLoading}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-12"
            >
              {(demoAuthLoading || (/*profileLoading && */demoAuthLoading)) ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin" />
                  Loading Demo...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Try Demo Now
                </div>
              )}
            </Button>
          </div>
        </Card>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#333333]" />
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="bg-black px-4 text-[#666666] font-medium">Or sign in</span>
          </div>
        </div>
        
        {/* Email/Password Login */}
        <Card className="bg-[#141414] border-[#1F1F1F] p-8">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Admin Login</h3>
            <Button
              onClick={fillDemoCredentials}
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80 hover:bg-primary/10 text-xs"
              disabled={isLoading}
            >
              <User className="w-3 h-3 mr-1" />
              Use Demo Credentials
            </Button>
          </div>
          
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#cccccc]">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-[#1A1A1A] border-[#333333] text-white placeholder:text-[#666666] focus-visible:ring-primary h-12"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#cccccc]">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-[#1A1A1A] border-[#333333] text-white placeholder:text-[#666666] focus-visible:ring-primary pr-12 h-12"
                  disabled={isLoading}
                  required
                />
          <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#666666] hover:text-primary transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#1A1A1A] hover:bg-[#242424] text-white border border-[#333333] h-12"
            >
              {(authLoading || (/*profileLoading && */authLoading)) ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Card>

        {/* Google OAuth */}
        <Card className="bg-[#141414] border-[#1F1F1F] p-8">
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full bg-white hover:text-primary text-black border-gray-300 h-12 font-medium"
          >
            {(authLoading || (/*profileLoading && */authLoading)) ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-t-2 border-black rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              <>
                <FaGoogle className="w-5 h-5 mr-3" />
                Continue with Google
              </>
            )}
          </Button>
        </Card>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-sm text-[#666666]">
            This is a portfolio demonstration of a cybersecurity monitoring system
          </p>
          <p className="text-xs text-[#555555] mt-2">
            New user registration is disabled. Use the demo account to explore.
          </p>
        </div>
      </div>
    </div>
  );
} 
