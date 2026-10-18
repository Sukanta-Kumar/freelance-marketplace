export type Role = 'CLIENT' | 'FREELANCER' | 'ADMIN';

export const Role = {
  CLIENT: 'CLIENT' as Role,
  FREELANCER: 'FREELANCER' as Role,
  ADMIN: 'ADMIN' as Role,
} as const;

export type ProjectStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export const ProjectStatus = {
  OPEN: 'OPEN' as ProjectStatus,
  IN_PROGRESS: 'IN_PROGRESS' as ProjectStatus,
  COMPLETED: 'COMPLETED' as ProjectStatus,
  CANCELLED: 'CANCELLED' as ProjectStatus,
} as const;

export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export const BidStatus = {
  PENDING: 'PENDING' as BidStatus,
  ACCEPTED: 'ACCEPTED' as BidStatus,
  REJECTED: 'REJECTED' as BidStatus,
  WITHDRAWN: 'WITHDRAWN' as BidStatus,
} as const;

export type ContractStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';

export const ContractStatus = {
  ACTIVE: 'ACTIVE' as ContractStatus,
  COMPLETED: 'COMPLETED' as ContractStatus,
  CANCELLED: 'CANCELLED' as ContractStatus,
  DISPUTED: 'DISPUTED' as ContractStatus,
} as const;

export type MilestoneStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'PAID'
  | 'REJECTED';

export const MilestoneStatus = {
  PENDING: 'PENDING' as MilestoneStatus,
  IN_PROGRESS: 'IN_PROGRESS' as MilestoneStatus,
  SUBMITTED: 'SUBMITTED' as MilestoneStatus,
  APPROVED: 'APPROVED' as MilestoneStatus,
  PAID: 'PAID' as MilestoneStatus,
  REJECTED: 'REJECTED' as MilestoneStatus,
} as const;

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export const PaymentStatus = {
  PENDING: 'PENDING' as PaymentStatus,
  COMPLETED: 'COMPLETED' as PaymentStatus,
  FAILED: 'FAILED' as PaymentStatus,
} as const;
