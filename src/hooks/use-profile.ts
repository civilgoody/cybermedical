import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { supabase } from '@/utils/supabase/client'
import { queryKeys, queryConfigs } from '@/lib/query-client'

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
    [key: string]: any;
  };
}

// Fetch current user
const fetchUser = async (): Promise<User | null> => {
  const { data: { user }, error } = await supabase().auth.getUser()
  if (error) throw error
  return user
}

// Fetch user profile
const fetchProfile = async (userId: string): Promise<Profile | null> => {
  console.log('Fetching profile for user:', userId) // Debug log
  const { data, error } = await supabase()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  
  if (error) throw error
  return data
}

// Create or update profile
const upsertProfile = async ({ userId, profile }: { userId: string; profile: Partial<Profile> }): Promise<Profile> => {
  const { data, error } = await supabase()
    .from('profiles')
    .upsert({ id: userId, ...profile })
    .select('*')
    .single()
  
  if (error) throw error
  return data
}

// Extract names from user metadata
const extractNamesFromMetadata = (user: User) => {
  const metadata = user.user_metadata || {}
  const fullName = metadata.full_name || metadata.name || ''
  const nameParts = fullName.trim().split(' ')
  const firstName = nameParts.shift() || ''
  const lastName = nameParts.join(' ')
  return { firstName, lastName }
}

// Main hook for user data
export const useUser = () => {
  return useQuery({
    queryKey: queryKeys.user.current,
    queryFn: fetchUser,
    ...queryConfigs.stable,
  })
}

// Hook for profile data
export const useProfile = () => {
  const queryClient = useQueryClient()
  const { data: user, isLoading: userLoading } = useUser()
  const initializationAttempted = useRef(false)
  const lastUserId = useRef<string | null>(null)

  // Reset initialization when user changes
  if (user?.id !== lastUserId.current) {
    initializationAttempted.current = false
    lastUserId.current = user?.id || null
  }

  const profileQuery = useQuery({
    queryKey: user?.id ? queryKeys.user.profile(user.id) : queryKeys.user.profile('no-user'),
    queryFn: () => user?.id ? fetchProfile(user.id) : null,
    enabled: !!user?.id,
    ...queryConfigs.stable,
  })

  // Separate mutation for initialization (internal)
  const initializationMutation = useMutation({
    mutationFn: upsertProfile,
    onSuccess: (data) => {
      if (user?.id) {
        queryClient.setQueryData(queryKeys.user.profile(user.id), data)
      }
    },
  })

  // Separate mutation for user updates (external)
  const updateMutation = useMutation({
    mutationFn: upsertProfile,
    onSuccess: (data) => {
      if (user?.id) {
        queryClient.setQueryData(queryKeys.user.profile(user.id), data)
      }
    },
  })

  // Handle profile initialization - only run once per user
  useEffect(() => {
    if (!user?.id || 
        userLoading || 
        profileQuery.isLoading || 
        initializationMutation.isPending ||
        initializationAttempted.current) {
      return
    }

    const initializeProfile = async () => {
      initializationAttempted.current = true

      try {
        // Wait for profile query to complete
        if (profileQuery.data === undefined) {
          return // Still loading
        }

        // Create profile if it doesn't exist
        if (profileQuery.data === null) {
          const { firstName, lastName } = extractNamesFromMetadata(user)
          
          await initializationMutation.mutateAsync({
            userId: user.id,
            profile: {
              first_name: firstName,
              last_name: lastName,
            }
          })
          return
        }

        // Update profile if names are missing
        if (profileQuery.data && (!profileQuery.data.first_name || !profileQuery.data.last_name)) {
          const { firstName, lastName } = extractNamesFromMetadata(user)
          
          await initializationMutation.mutateAsync({
            userId: user.id,
            profile: {
              ...profileQuery.data,
              first_name: firstName,
              last_name: lastName,
            }
          })
        }
      } catch (error) {
        console.error('Error initializing profile:', error)
        // Reset flag on error so we can try again if needed
        initializationAttempted.current = false
      }
    }

    // Only run once we have definitive data (not undefined)
    if (profileQuery.data !== undefined) {
      initializeProfile()
    }
  }, [user?.id, profileQuery.data]) // Minimal dependencies

  return {
    user,
    profile: profileQuery.data,
    isLoading: userLoading || profileQuery.isLoading || initializationMutation.isPending,
    error: profileQuery.error,
    isReady: !userLoading && !profileQuery.isLoading && !!profileQuery.data,
    updateProfile: updateMutation.mutateAsync, // Only expose the user update mutation
    isUpdating: updateMutation.isPending, // Only show updating state for user actions
  }
} 
