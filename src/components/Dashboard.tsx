"use client";

import { useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { ThreatReportSection } from "./threat-report-section";
import AttackFrequencyChart from "./attack-frequency-chart";
import SeverityBreakdownChart from "./severity-breakdown-chart";
import ThreatTypeChart from "./threat-type-chart";

export default function Dashboard() {
  useEffect(() => {
    async function upsertProfile() {
      // Retrieve the current user
      const {
        data: { user },
      } = await supabase().auth.getUser();

      if (user) {
        // Attempt to fetch an existing profile using the user's id
        const { data: profile, error: fetchError } = await supabase()
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (fetchError) {
          console.error("Error fetching profile:", fetchError);
        }

        // Only try to create the profile if it doesn't exist
        if (!profile) {
          const metadata = user.user_metadata || {};
          const fullName = metadata.full_name || metadata.name || "";
          // Split the full name into parts
          const nameParts = fullName.trim().split(" ");
          console.log("nameParts", nameParts);
          let firstName = nameParts.shift() || "";
          let lastName = nameParts.join(" ");
          
          // Upsert the profile with first and last name
          const { error: profileError } = await supabase()
            .from("profiles")
            .upsert({
              id: user.id,
              first_name: firstName,
              last_name: lastName,
            });

          if (profileError) {
            console.error("Error upserting profile:", profileError);
          } else {
            console.log("Profile created successfully");
          }
        } else {
          console.log("Profile already exists. Skipping upsert.");
        }
      }
    }

    upsertProfile();
  }, []);

  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-12 gap-6">
        {/* AI Threat Report Section */}
        <div className="col-span-4">
          <ThreatReportSection />
        </div>
        {/* Charts and additional info */}
        <div className="col-span-8 space-y-6">
          <AttackFrequencyChart />
          <div className="grid grid-cols-2 gap-6">
            <SeverityBreakdownChart />
            <ThreatTypeChart />
          </div>
        </div>
      </div>
    </main>
  );
} 
