'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Card } from "@/components/ui/card";
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';


const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords do not match',
      path: ['confirmPassword']
    });
  }
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpForm, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      // Validate form data
      const formData = { name, email, password, confirmPassword };
      signUpSchema.parse(formData);

      setLoading(true);

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user record in users table
        const { error: dbError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: authData.user.email,
              name: name,
              password_hash: '', // We don't store the actual password, Supabase Auth handles this
            }
          ]);

        if (dbError) throw dbError;

        // Sign in the user
        await signIn('credentials', {
          email,
          password,
          callbackUrl: '/',
          redirect: true,
        });
      }
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof SignUpForm, string>> = {};
        err.errors.forEach((error: z.ZodIssue) => {
          const path = error.path[0];
          if (path) {
            fieldErrors[path as keyof SignUpForm] = error.message;
          }
        });
        setErrors(fieldErrors);
      } else if ((err as PostgrestError).code) {
        console.error('Database error during sign up:', err);
        setErrors({ email: 'An error occurred during sign up. Please try again.' });
      } else {
        console.error('Error during sign up:', err);
        setErrors({ email: 'An error occurred during sign up. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background border-border p-8 rounded-xl">
        <h1 className="text-2xl font-bold text-foreground mb-6 text-center">Create Account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-muted mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
              }}
              className={`w-full px-3 py-2 bg-[#1A1A1A] border ${errors.name ? 'border-red-500' : 'border-border'} rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

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
                if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
              }}
              className={`w-full px-3 py-2 bg-[#1A1A1A] border ${errors.password ? 'border-red-500' : 'border-border'} rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
              }}
              className={`w-full px-3 py-2 bg-[#1A1A1A] border ${errors.confirmPassword ? 'border-red-500' : 'border-border'} rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary`}
              required
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-foreground py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-primary hover:underline">
            Sign in
          </a>
        </p>
      </Card>
    </div>
  );
} 
