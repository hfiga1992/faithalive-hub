import { QueryClient } from '@tanstack/react-query';

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Retry configuration
        retry: (failureCount, error: any) => {
          // Don't retry on 404 or authentication errors
          if (error?.status === 404 || error?.code === 'PGRST116') {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Stale time and cache configuration
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
        
        // Refetch configuration
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
        
        // Network mode
        networkMode: 'online',
      },
      mutations: {
        retry: false, // Don't retry mutations by default
        networkMode: 'online',
      },
    },
  });
};

// Error logging utility
export const logQueryError = (context: string, error: any) => {
  const timestamp = new Date().toISOString();
  console.error(`🔴 [${timestamp}] Query Error in ${context}:`, {
    message: error?.message || 'Unknown error',
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
    status: error?.status,
  });
};
