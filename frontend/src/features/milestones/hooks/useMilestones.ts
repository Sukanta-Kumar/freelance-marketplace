import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { milestonesApi } from '@/api/milestones';
import { queryKeys } from '@/lib/queryKeys';
import {
  CreateMilestoneRequest,
  SubmitMilestoneRequest,
  RejectMilestoneRequest,
  UpdateMilestoneRequest,
} from '@/types/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';

/**
 * Fetch all milestones for a specific contract.
 */
export function useContractMilestones(contractId?: number | null) {
  const numericId = Number(contractId);
  return useQuery({
    queryKey: queryKeys.milestones.byContract(numericId),
    queryFn: () => milestonesApi.getMilestonesByContract(numericId),
    enabled: !isNaN(numericId) && numericId > 0,
  });
}

/**
 * Fetch a single milestone by ID.
 */
export function useMilestone(id?: number | null) {
  const numericId = Number(id);
  return useQuery({
    queryKey: queryKeys.milestones.detail(numericId),
    queryFn: () => milestonesApi.getMilestoneById(numericId),
    enabled: !isNaN(numericId) && numericId > 0,
  });
}

/**
 * Client creates a new milestone within the contract.
 */
export function useCreateMilestone(contractId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<CreateMilestoneRequest, 'contractId'>) =>
      milestonesApi.createMilestone({
        ...payload,
        contractId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.milestones.byContract(contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.detail(contractId) });
      toast.success('Milestone added', {
        description: 'New deliverable milestone added to the contract escrow schedule.',
      });
    },
    onError: (err) => {
      toast.error('Failed to create milestone', {
        description: getErrorMessage(err),
      });
    },
  });
}

/**
 * Freelancer marks a pending milestone as in-progress.
 */
export function useStartMilestone(contractId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (milestoneId: number) => milestonesApi.startMilestone(milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.milestones.byContract(contractId) });
      toast.success('Milestone started', {
        description: 'Work is now officially in progress.',
      });
    },
    onError: (err) => {
      toast.error('Failed to start milestone', {
        description: getErrorMessage(err),
      });
    },
  });
}

/**
 * Freelancer submits deliverable work (or resubmits after feedback).
 */
export function useSubmitMilestone(contractId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SubmitMilestoneRequest }) =>
      milestonesApi.submitMilestone(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.milestones.byContract(contractId) });
      toast.success('Deliverable submitted', {
        description: 'Client notified for verification and escrow release.',
      });
    },
    onError: (err) => {
      toast.error('Failed to submit deliverable', {
        description: getErrorMessage(err),
      });
    },
  });
}

/**
 * Client approves deliverable and releases escrow funds to the freelancer.
 */
export function useApproveMilestone(contractId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (milestoneId: number) => milestonesApi.approveMilestone(milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.milestones.byContract(contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.detail(contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
    onError: (err) => {
      toast.error('Failed to release milestone payment', {
        description: getErrorMessage(err),
      });
    },
  });
}

/**
 * Client rejects deliverable and requests revisions.
 */
export function useRejectMilestone(contractId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RejectMilestoneRequest }) =>
      milestonesApi.rejectMilestone(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.milestones.byContract(contractId) });
      toast.success('Revision requested', {
        description: 'Engineer notified with specific revision feedback.',
      });
    },
    onError: (err) => {
      toast.error('Failed to request revision', {
        description: getErrorMessage(err),
      });
    },
  });
}

/**
 * Update milestone details (title, amount, etc. if PENDING).
 */
export function useUpdateMilestone(contractId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateMilestoneRequest }) =>
      milestonesApi.updateMilestone(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.milestones.byContract(contractId) });
      toast.success('Milestone updated');
    },
    onError: (err) => {
      toast.error('Failed to update milestone', {
        description: getErrorMessage(err),
      });
    },
  });
}
