import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';

// Types
export interface AdminReport {
  id: string;
  admin: string;
  reports: string;
  created_at: string;
  profiles?: {
    first_name: string;
  } | null;
}

// API functions
const fetchAdminReports = async (): Promise<AdminReport[]> => {
  console.log('📊 Fetching admin reports via API...');
  
  const response = await fetch('/api/admin-reports', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('✅ Admin reports fetched successfully:', { count: data?.length || 0 });
  
  return data || [];
};

const createAdminReport = async (reports: string): Promise<AdminReport> => {
  console.log('📝 Creating admin report via API...');
  
  const response = await fetch('/api/admin-reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reports }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create admin report');
  }

  const data = await response.json();
  console.log('✅ Admin report created successfully');
  
  return data;
};

const deleteAdminReport = async (reportId: string): Promise<void> => {
  console.log('🗑️ Deleting admin report via API...');
  
  const response = await fetch(`/api/admin-reports?id=${reportId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete admin report');
  }

  console.log('✅ Admin report deleted successfully');
};

// Hooks
export const useAdminReports = () => {
  console.log('📋 useAdminReports hook called');
  
  const query = useQuery({
    queryKey: queryKeys.adminReports.all,
    queryFn: fetchAdminReports,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });

  console.log('📈 Admin reports query state:', { 
    isLoading: query.isLoading, 
    isError: query.isError, 
    dataLength: query.data?.length,
    error: query.error
  });

  return query;
};

export const useCreateAdminReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createAdminReport,
    onSuccess: (newReport) => {
      // Add the new report to the cache optimistically
      queryClient.setQueryData<AdminReport[]>(
        queryKeys.adminReports.all,
        (oldData) => {
          if (!oldData) return [newReport];
          return [newReport, ...oldData];
        }
      );
      
      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.adminReports.all });
    },
    onError: (error) => {
      console.error('Failed to create admin report:', error);
    },
  });
};

export const useDeleteAdminReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAdminReport,
    onMutate: async (reportId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.adminReports.all });
      
      // Snapshot the previous value
      const previousReports = queryClient.getQueryData<AdminReport[]>(queryKeys.adminReports.all);
      
      // Optimistically update to remove the report
      queryClient.setQueryData<AdminReport[]>(
        queryKeys.adminReports.all,
        (oldData) => {
          if (!oldData) return [];
          return oldData.filter(report => report.id !== reportId);
        }
      );
      
      // Return a context with the previous and new values
      return { previousReports, reportId };
    },
    onError: (err, reportId, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousReports) {
        queryClient.setQueryData(queryKeys.adminReports.all, context.previousReports);
      }
      console.error('Failed to delete admin report:', err);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is correct
      queryClient.invalidateQueries({ queryKey: queryKeys.adminReports.all });
    },
  });
};

export const useRefreshAdminReports = () => {
  const queryClient = useQueryClient();
  
  const refresh = async () => {
    console.log('🔄 Manual admin reports refresh triggered');
    
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.adminReports.all }),
      queryClient.refetchQueries({ queryKey: queryKeys.adminReports.all })
    ]);
    
    console.log('✅ Admin reports refresh completed');
  };

  return refresh;
}; 
 