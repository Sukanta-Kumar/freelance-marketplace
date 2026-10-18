import { MilestoneStatus, Role } from '@/types/enums';

export interface MilestoneActionsResult {
  canStart: boolean;
  canSubmit: boolean;
  canResubmit: boolean;
  canApprove: boolean;
  canReject: boolean;
  canEdit: boolean;
}

/**
 * Pure function to derive allowed actions on a milestone based on the actor's role,
 * current milestone status, and ownership flags.
 *
 * Prevents 403 errors by strictly hiding unavailable transitions.
 */
export function milestoneActions(
  role: Role | null | undefined,
  status: MilestoneStatus,
  isOwner: boolean
): MilestoneActionsResult {
  // If not authenticated or not party to this contract, allow zero mutating actions
  if (!role || !isOwner) {
    return {
      canStart: false,
      canSubmit: false,
      canResubmit: false,
      canApprove: false,
      canReject: false,
      canEdit: false,
    };
  }

  if (role === 'FREELANCER') {
    return {
      canStart: status === 'PENDING',
      canSubmit: status === 'IN_PROGRESS',
      canResubmit: status === 'REJECTED',
      canApprove: false,
      canReject: false,
      canEdit: false,
    };
  }

  if (role === 'CLIENT') {
    return {
      canStart: false,
      canSubmit: false,
      canResubmit: false,
      canApprove: status === 'SUBMITTED',
      canReject: status === 'SUBMITTED',
      canEdit: status === 'PENDING',
    };
  }

  // Admin or other roles have read-only visibility
  return {
    canStart: false,
    canSubmit: false,
    canResubmit: false,
    canApprove: false,
    canReject: false,
    canEdit: false,
  };
}
