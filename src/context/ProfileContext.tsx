"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/utils/supabase/client";

// Define a type for the profile.
interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  // If you later decide to use full_name, you can add it here as well.
}

// Define the context type.
interface ProfileContextType {
  profileLoaded: boolean;
  profile: Profile | null;
  reloadProfile: () => Promise<void>;
}

// Create the context with default values.
const ProfileContext = createContext<ProfileContextType>({
  profileLoaded: false,
  profile: null,
  reloadProfile: async () => {},
});

// Provider component to wrap your app.
export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = async () => {
    // Retrieve the current user.
    const {
      data: { user },
    } = await supabase().auth.getUser();

    if (user) {
      // Try to fetch an existing profile.
      const { data: existingProfile, error } = await supabase()
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
      }

      if (existingProfile) {
        // If a profile exists, save it.
        setProfile(existingProfile as Profile);
      } else {
        // If no profile exists, upsert one.
        const metadata = user.user_metadata || {};
        // Extract full name from metadata (Google returns full name or name).
        const fullName = metadata.full_name || metadata.name || "";
        // Split fullName into first and last name.
        const nameParts = fullName.trim().split(" ");
        console.log("nameParts", nameParts);
        const firstName = nameParts.shift() || "";
        const lastName = nameParts.join(" ");

        const { error: upsertError, data: newProfile } = await supabase()
          .from("profiles")
          .upsert({
            id: user.id,
            first_name: firstName,
            last_name: lastName,
          })
          .select("*")
          .maybeSingle();

        if (upsertError) {
          console.error("Error upserting profile:", upsertError);
        } else {
          setProfile(newProfile as Profile);
        }
      }
    }
    setProfileLoaded(true);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const reloadProfile = async () => {
    setProfileLoaded(false);
    await loadProfile();
  };

  return (
    <ProfileContext.Provider value={{ profileLoaded, profile, reloadProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook for easy access to the context.
export const useProfile = () => useContext(ProfileContext);
