import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { queryKeys } from '@/lib/queryKeys';
import { UserResponse } from '@/types/api';

export function useUser(userId?: number | null) {
  const query = useQuery<UserResponse, Error>({
    queryKey: queryKeys.users.detail(userId || 0),
    queryFn: () => authApi.getUserById(userId!),
    enabled: typeof userId === 'number' && userId > 0,
    staleTime: 1000 * 60 * 10, // 10 minutes caching
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    fullName: query.data?.fullName,
    email: query.data?.email,
  };
}
