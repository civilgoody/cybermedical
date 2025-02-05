'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Card } from "@/components/ui/card";

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl: '/',
        redirect: true,
      });
    } catch (error) {
      console.error('Error during sign up:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#141414] border-[#1F1F1F] p-8 rounded-xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF29A8]"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#333333] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF29A8]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF29A8] text-white py-2 rounded-md hover:bg-[#FF29A8]/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#333333]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#141414] text-gray-300">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="flex justify-center items-center px-4 py-2 border border-[#333333] rounded-md hover:bg-[#1A1A1A] transition-colors"
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => signIn('facebook', { callbackUrl: '/' })}
              className="flex justify-center items-center px-4 py-2 border border-[#333333] rounded-md hover:bg-[#1A1A1A] transition-colors"
            >
              <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => signIn('apple', { callbackUrl: '/' })}
              className="flex justify-center items-center px-4 py-2 border border-[#333333] rounded-md hover:bg-[#1A1A1A] transition-colors"
            >
              <img src="/apple.svg" alt="Apple" className="w-5 h-5" />
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-[#FF29A8] hover:underline">
            Sign in
          </a>
        </p>
      </Card>
    </div>
  );
} 
