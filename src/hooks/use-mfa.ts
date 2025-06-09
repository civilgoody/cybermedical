import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase/client';
import { queryConfigs, queryKeys } from '@/lib/query-client';

interface MFAEnrollData {
  id: string;
  totp: {
    qr_code: string;
    secret: string;
  };
}

// Fetch MFA factors
const fetchMFAFactors = async () => {
  const { data, error } = await supabase().auth.mfa.listFactors();
  if (error) throw error;
  return data?.totp || [];
};

// MFA enrollment
const enrollMFA = async (): Promise<MFAEnrollData> => {
  const { data, error } = await supabase().auth.mfa.enroll({ factorType: "totp" });
  if (error) throw error;
  return data;
};

// MFA verification
const verifyMFA = async ({ factorId, code }: { factorId: string; code: string }): Promise<void> => {
  const challengeResponse = await supabase().auth.mfa.challenge({ factorId });
  if (challengeResponse.error) throw challengeResponse.error;

  const challengeId = challengeResponse.data.id;
  const verifyResponse = await supabase().auth.mfa.verify({
    factorId,
    challengeId,
    code,
  });

  if (verifyResponse.error) throw verifyResponse.error;
};

// MFA unenrollment
const unenrollMFA = async ({ factorId, code }: { factorId: string; code: string }): Promise<void> => {
  // First verify the code
  await verifyMFA({ factorId, code });
  
  // Then unenroll
  const { error } = await supabase().auth.mfa.unenroll({ factorId });
  if (error) throw error;
};

export function useMFA() {
  const queryClient = useQueryClient();

  // Query MFA factors
  const {
    data: mfaFactors = [],
    isLoading: isLoadingFactors,
    error: factorsError,
  } = useQuery({
    queryKey: queryKeys.mfa.factors(),
    queryFn: fetchMFAFactors,
    ...queryConfigs.stable,
  });

  // Derived state
  const isMFAEnabled = mfaFactors.length > 0;
  const activeFactor = mfaFactors[0] || null;

  // Enroll mutation
  const enrollMutation = useMutation({
    mutationFn: enrollMFA,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mfa.factors() });
    },
  });

  // Verify mutation
  const verifyMutation = useMutation({
    mutationFn: verifyMFA,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mfa.factors() });
    },
  });

  // Unenroll mutation
  const unenrollMutation = useMutation({
    mutationFn: unenrollMFA,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mfa.factors() });
    },
  });

  return {
    // State
    mfaFactors,
    isMFAEnabled,
    activeFactor,
    isLoadingFactors,
    factorsError,

    // Mutations
    enrollMFA: enrollMutation.mutateAsync,
    verifyMFA: verifyMutation.mutateAsync,
    unenrollMFA: unenrollMutation.mutateAsync,

    // Loading states
    isEnrolling: enrollMutation.isPending,
    isVerifying: verifyMutation.isPending,
    isUnenrolling: unenrollMutation.isPending,

    // Errors
    enrollError: enrollMutation.error,
    verifyError: verifyMutation.error,
    unenrollError: unenrollMutation.error,
  };
} 
 