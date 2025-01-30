import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <Shield className="h-24 w-24 text-green-500/50 animate-pulse" />
        </div>
        <h1 className="text-6xl font-bold cyber-glow text-green-400">404</h1>
        <h2 className="text-2xl text-green-300/80">Access Denied</h2>
        <p className="text-green-300/60 max-w-md">
          The requested resource could not be located on this server. Security scan complete.
        </p>
        <Link 
          href="/" 
          className="inline-block px-6 py-3 mt-4 border border-green-500/20 bg-green-500/10 
                     text-green-400 hover:bg-green-500/20 transition-all duration-300 
                     rounded-md backdrop-blur-sm hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]"
        >
          Return to Command Center
        </Link>
      </div>
    </div>
  );
} 
