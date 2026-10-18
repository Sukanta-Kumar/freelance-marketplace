import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractsApi } from '@/api/contracts';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';

/**
 * Fetch a single contract by ID.
 */
export function useContract(id?: number | null) {
  const numericId = Number(id);
  return useQuery({
    queryKey: queryKeys.contracts.detail(numericId),
    queryFn: () => contractsApi.getContractById(numericId),
    enabled: !isNaN(numericId) && numericId > 0,
  });
}

/**
 * Fetch all contracts relevant to the currently authenticated user (as Client or Freelancer).
 */
export function useMyContracts() {
  const { userId, role } = useAuthStore();
  const numericId = Number(userId);

  return useQuery({
    queryKey:
      role === 'FREELANCER'
        ? queryKeys.contracts.byFreelancer(numericId)
        : queryKeys.contracts.byClient(numericId),
    queryFn: async () => {
      if (!numericId) return [];
      if (role === 'FREELANCER') {
        return contractsApi.getContractsByFreelancer(numericId);
      }
      return contractsApi.getContractsByClient(numericId);
    },
    enabled: !isNaN(numericId) && numericId > 0,
  });
}

/**
 * Mark a contract as completed when all milestones are settled.
 */
export function useCompleteContract(contractId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => contractsApi.completeContract(contractId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.detail(contractId) });
      toast.success('Contract completed', {
        description: 'All milestones settled and contract closed successfully.',
      });
    },
    onError: (err) => {
      toast.error('Failed to complete contract', {
        description: getErrorMessage(err),
      });
    },
  });
}

/**
 * Cancel a contract.
 */
export function useCancelContract(contractId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => contractsApi.cancelContract(contractId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.detail(contractId) });
      toast.success('Contract cancelled');
    },
    onError: (err) => {
      toast.error('Failed to cancel contract', {
        description: getErrorMessage(err),
      });
    },
  });
}
