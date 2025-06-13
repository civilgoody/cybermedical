import { queryConfigs, queryKeys } from "@/lib/query-client";
import { supabase } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define a type for the profile
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

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  [key: string]: any; // Allow additional properties from Supabase
}

// Fetch current user
const fetchUser = async (): Promise<User | null> => {
  const {
    data: { user },
    error,
  } = await supabase().auth.getUser();
  if (error) throw error;
  return user as User | null;
};

// Fetch user profile
const fetchProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase()
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // Not found is OK
    throw error;
  }

  return data;
};

// Create or update profile
const upsertProfile = async ({
  userId,
  profile,
}: {
  userId: string;
  profile: Partial<Profile>;
}): Promise<Profile> => {
  const { data, error } = await supabase()
    .from("profiles")
    .upsert({ id: userId, ...profile })
    .select("*")
    .single();

  if (error) throw error;
  return data;
};

// Main hook for user data with hydration fix
export const useUser = () => {
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration mismatch - don't render until mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Listen for auth state changes only after mounting
    const { data: authListener } = supabase().auth.onAuthStateChange(
      (event, session) => {
        console.log("👤 User hook auth change:", event, {
          hasSession: !!session,
        });

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          // Invalidate and refetch user data
          console.log("🔄 Invalidating user data...");
          queryClient.invalidateQueries({ queryKey: queryKeys.user.current });
          queryClient.refetchQueries({ queryKey: queryKeys.user.current });
        } else if (event === "SIGNED_OUT") {
          // Immediately set user data to null and invalidate
          console.log("❌ Clearing user data in hook...");
          queryClient.setQueryData(queryKeys.user.current, null);
          queryClient.invalidateQueries({ queryKey: queryKeys.user.current });
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, [queryClient, isMounted]);

  const query = useQuery({
    queryKey: queryKeys.user.current,
    queryFn: async () => {
      if (!isMounted) return null; // Don't fetch until mounted

      console.log("📊 Fetching user data...");
      const result = await fetchUser();
      console.log("👤 User data result:", {
        hasUser: !!result,
        userId: result?.id,
      });
      return result;
    },
    enabled: isMounted, // Only run query after component is mounted
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 30000),
  });

  // Return null data if not mounted to prevent hydration mismatch
  if (!isMounted) {
    return {
      ...query,
      data: null,
      isLoading: true,
      error: null,
    };
  }

  return query;
};

// Hook for profile data with mounted state
export const useProfile = () => {
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);
  const { data: user, isLoading: userLoading, error: userError } = useUser();
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const profileQuery = useQuery({
    queryKey: user?.id
      ? queryKeys.profile(user.id)
      : queryKeys.profile("no-user"),
    queryFn: () => (user?.id ? fetchProfile(user.id) : null),
    enabled: !!user?.id && isMounted,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Mutation for profile updates
  const updateMutation = useMutation({
    mutationFn: upsertProfile,
    onSuccess: (data) => {
      if (user?.id) {
        queryClient.setQueryData(queryKeys.profile(user.id), data);
      }
    },
  });

  const handleSignOut = async () => {
    try {
      const { error } = await supabase().auth.signOut();
      if (error) throw error;

      // Clear all React Query cache data after successful sign-out
      queryClient.cancelQueries();
      queryClient.clear();
      router.push("/");

      // Optionally, redirect the user to a login page or home page
      // router.push('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Return safe defaults if not mounted
  if (!isMounted) {
    return {
      user: null,
      userLoading: true,
      userError: null,
      profile: null,
      profileLoading: false,
      profileError: null,
      isLoading: true,
      error: null,
      updateProfile: updateMutation.mutateAsync,
      isUpdating: false,
      updateError: null,
    };
  }

  return {
    // User data
    user,
    userLoading,
    userError,

    // Profile data
    profile: profileQuery.data,
    profileLoading: profileQuery.isLoading,
    profileError: profileQuery.error,

    // Simple loading state - only block for user, not profile
    isLoading: userLoading,
    error: userError || profileQuery.error,

    // Mutation methods
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    handleSignOut,
  };
};
