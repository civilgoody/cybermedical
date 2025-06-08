"use client";

import React, { createContext, useContext } from "react";
import { useProfile as useProfileHook } from "@/hooks/use-profile";

// Define a type for the profile.
interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  country?: string;
  city?: string;
  post_code?: string;
}

// Define the context type.
interface ProfileContextType {
  profileLoaded: boolean;
  profile: Profile | null;
  loading: boolean;
}

// Create the context with default values.
const ProfileContext = createContext<ProfileContextType>({
  profileLoaded: false,
  profile: null,
  loading: false,
});

// Provider component to wrap your app.
export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, isLoading, isReady, updateProfile } = useProfileHook();


  return (
    <ProfileContext.Provider 
      value={{ 
        profileLoaded: isReady, 
        profile: profile || null, 
        loading: isLoading 
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook for easy access to the context.
export const useProfile = () => useContext(ProfileContext);
