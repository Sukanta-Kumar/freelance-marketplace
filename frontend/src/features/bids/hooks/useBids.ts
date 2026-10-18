import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bidsApi } from '@/api/bids';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/stores/authStore';
import { BidRequest, UpdateBidRequest } from '@/types/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';

/**
 * Hook to fetch all bids submitted for a specific project.
 */
export function useProjectBids(projectId?: number | null) {
  const numericId = Number(projectId);
  return useQuery({
    queryKey: queryKeys.bids.byProject(numericId),
    queryFn: () => bidsApi.getBidsByProject(numericId),
    enabled: !isNaN(numericId) && numericId > 0,
  });
}

/**
 * Hook to fetch bids submitted by the currently authenticated freelancer.
 */
export function useMyBids() {
  const userId = useAuthStore((state) => state.userId);
  const numericUserId = Number(userId);

  return useQuery({
    queryKey: queryKeys.bids.byFreelancer(numericUserId),
    queryFn: () => bidsApi.getBidsByFreelancer(numericUserId),
    enabled: !isNaN(numericUserId) && numericUserId > 0,
  });
}

/**
 * Mutation to submit a new proposal on a project.
 */
export function useCreateBid(projectId: number) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.userId);

  return useMutation({
    mutationFn: (payload: { amount: number; estimatedDays: number; proposal: string }) =>
      bidsApi.createBid({
        projectId,
        amount: payload.amount,
        estimatedDays: payload.estimatedDays,
        proposal: payload.proposal,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bids.byProject(projectId) });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.bids.byFreelancer(userId) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      toast.success('Proposal submitted', {
        description: 'The project owner has been notified.',
      });
    },
    onError: (err) => {
      toast.error('Failed to submit proposal', {
        description: getErrorMessage(err),
      });
    },
  });
}

/**
 * Mutation to edit an existing pending proposal.
 */
export function useUpdateBid(projectId?: number) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.userId);

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBidRequest }) =>
      bidsApi.updateBid(id, payload),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.bids.byProject(projectId) });
      }
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.bids.byFreelancer(userId) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.bids.all });
      toast.success('Proposal updated');
    },
    onError: (err) => {
      toast.error('Failed to update proposal', {
        description: getErrorMessage(err),
      });
    },
  });
}

/**
 * Mutation to withdraw/delete a pending proposal.
 */
export function useWithdrawBid(projectId?: number) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.userId);

  return useMutation({
    mutationFn: (bidId: number) => bidsApi.deleteBid(bidId),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.bids.byProject(projectId) });
      }
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.bids.byFreelancer(userId) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.bids.all });
      toast.success('Proposal withdrawn');
    },
    onError: (err) => {
      toast.error('Failed to withdraw proposal', {
        description: getErrorMessage(err),
      });
    },
  });
}

/**
 * Mutation for project owner to accept a proposal.
 */
export function useAcceptBid(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bidId: number) => bidsApi.acceptBid(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.bids.byProject(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.all });
      toast.success('Bid accepted', {
        description: 'Contract generated and escrow budget initialized.',
      });
    },
    onError: (err) => {
      toast.error('Failed to accept bid', {
        description: getErrorMessage(err),
      });
    },
  });
}

/**
 * Mutation for project owner to decline a proposal.
 */
export function useRejectBid(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bidId: number) => bidsApi.rejectBid(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bids.byProject(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.bids.all });
      toast.success('Proposal declined');
    },
    onError: (err) => {
      toast.error('Failed to decline bid', {
        description: getErrorMessage(err),
      });
    },
  });
}
