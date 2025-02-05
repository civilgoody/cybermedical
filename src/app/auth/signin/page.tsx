'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Card } from "@/components/ui/card";
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

type SignInForm = z.infer<typeof signInSchema>;
type ZodError = z.ZodError;

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignInForm, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      // Validate form data
      const formData = { email, password };
      signInSchema.parse(formData);

      setLoading(true);

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setErrors({ email: 'Invalid email or password' });
        return;
      }

      // Sign in with NextAuth
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/',
        redirect: true,
      });
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof SignInForm, string>> = {};
        err.errors.forEach((error: z.ZodIssue) => {
          const path = error.path[0];
          if (path) {
            fieldErrors[path as keyof SignInForm] = error.message;
          }
        });
        setErrors(fieldErrors);
      } else if ((err as PostgrestError).code) {
        console.error('Database error during sign in:', err);
        setErrors({ email: 'Invalid email or password' });
      } else {
        console.error('Error during sign in:', err);
        setErrors({ email: 'An error occurred during sign in. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background border-border p-8 rounded-xl">
        <h1 className="text-2xl font-bold text-foreground mb-6 text-center">Sign In</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
              }}
              className={`w-full px-3 py-2 bg-[#1A1A1A] border ${errors.email ? 'border-red-500' : 'border-border'} rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
              }}
              className={`w-full px-3 py-2 bg-[#1A1A1A] border ${errors.password ? 'border-red-500' : 'border-border'} rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-foreground py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="flex justify-center items-center px-4 py-2 border border-border rounded-md hover:bg-[#1A1A1A] transition-colors"
            >
              <FcGoogle className="w-5 h-5" />
            </button>
            
            <button
              type="button"
              onClick={() => signIn('facebook', { callbackUrl: '/' })}
              className="flex justify-center items-center px-4 py-2 border border-border rounded-md hover:bg-[#1A1A1A] transition-colors"
            >
              <FaFacebook className="w-5 h-5 text-[#1877F2]" />
            </button>
            
            <button
              type="button"
              onClick={() => signIn('apple', { callbackUrl: '/' })}
              className="flex justify-center items-center px-4 py-2 border border-border rounded-md hover:bg-[#1A1A1A] transition-colors"
            >
              <FaApple className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account?{' '}
          <a href="/auth/signup" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </Card>
    </div>
  );
} 
