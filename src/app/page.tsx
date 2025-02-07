'use client';

import { redirect } from "next/navigation"
import { ThreatReportSection } from "../components/threat-report-section"
import NetworkTrafficChart from "../components/network-traffic-chart"
import ThreatMap from "../components/threat-map"
import ThreatTypeChart from "../components/threat-type-chart"
import { supabase } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { Session } from '@supabase/supabase-js'

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase().auth.getSession();
        if (error) throw error;
        
        if (!currentSession) {
          redirect('/auth/signin');
        }
        
        setSession(currentSession);
      } catch (error) {
        console.error('Error checking auth:', error);
        redirect('/auth/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Dashboard</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* AI Threat Report - 4 columns */}
        <div className="col-span-4">
          <ThreatReportSection />
        </div>

        {/* Right side content - 8 columns */}
        <div className="col-span-8 space-y-6">
          {/* Network Traffic takes full width */}
          <NetworkTrafficChart />

          {/* Bottom row split into two */}
          <div className="grid grid-cols-2 gap-6">
            <ThreatMap />
            <ThreatTypeChart />
          </div>
        </div>
      </div>
    </main>
  );
}

