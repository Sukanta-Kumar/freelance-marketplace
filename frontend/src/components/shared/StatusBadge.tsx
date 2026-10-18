import React from 'react';
import { cn } from '@/lib/cn';
import {
  ProjectStatus,
  BidStatus,
  ContractStatus,
  MilestoneStatus,
  PaymentStatus,
} from '@/types/enums';

export type AnyStatus =
  | ProjectStatus
  | BidStatus
  | ContractStatus
  | MilestoneStatus
  | PaymentStatus;

interface StatusConfig {
  label: string;
  dotColor: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  needsAction?: boolean;
}

export const statusConfigMap: Record<string, StatusConfig> = {
  // Action needed states
  SUBMITTED: {
    label: 'Awaiting Review',
    dotColor: 'bg-amber-500',
    bgClass: 'bg-amber-500/10 dark:bg-amber-500/15',
    textClass: 'text-amber-700 dark:text-amber-400 font-medium',
    borderClass: 'border-amber-500/20 dark:border-amber-500/30',
    needsAction: true,
  },
  PENDING: {
    label: 'Pending',
    dotColor: 'bg-amber-500',
    bgClass: 'bg-amber-500/10 dark:bg-amber-500/15',
    textClass: 'text-amber-700 dark:text-amber-400 font-medium',
    borderClass: 'border-amber-500/20 dark:border-amber-500/30',
    needsAction: true,
  },
  REJECTED: {
    label: 'Needs Revision',
    dotColor: 'bg-rose-500',
    bgClass: 'bg-rose-500/10 dark:bg-rose-500/15',
    textClass: 'text-rose-700 dark:text-rose-400 font-medium',
    borderClass: 'border-rose-500/20 dark:border-rose-500/30',
    needsAction: true,
  },

  // Active / in-progress states
  IN_PROGRESS: {
    label: 'In Progress',
    dotColor: 'bg-blue-500',
    bgClass: 'bg-transparent',
    textClass: 'text-ink font-medium',
    borderClass: 'border-border',
    needsAction: false,
  },
  OPEN: {
    label: 'Open',
    dotColor: 'bg-emerald-600 dark:bg-emerald-400',
    bgClass: 'bg-transparent',
    textClass: 'text-ink font-medium',
    borderClass: 'border-border',
    needsAction: false,
  },
  ACTIVE: {
    label: 'Active',
    dotColor: 'bg-emerald-600 dark:bg-emerald-400',
    bgClass: 'bg-transparent',
    textClass: 'text-ink font-medium',
    borderClass: 'border-border',
    needsAction: false,
  },

  // Settled / Terminal states
  APPROVED: {
    label: 'Approved',
    dotColor: 'bg-emerald-600 dark:bg-emerald-400',
    bgClass: 'bg-transparent',
    textClass: 'text-muted-foreground',
    borderClass: 'border-transparent',
    needsAction: false,
  },
  PAID: {
    label: 'Paid',
    dotColor: 'bg-emerald-600 dark:bg-emerald-400',
    bgClass: 'bg-transparent',
    textClass: 'text-muted-foreground',
    borderClass: 'border-transparent',
    needsAction: false,
  },
  ACCEPTED: {
    label: 'Accepted',
    dotColor: 'bg-emerald-600 dark:bg-emerald-400',
    bgClass: 'bg-transparent',
    textClass: 'text-muted-foreground',
    borderClass: 'border-transparent',
    needsAction: false,
  },
  COMPLETED: {
    label: 'Completed',
    dotColor: 'bg-zinc-400 dark:bg-zinc-500',
    bgClass: 'bg-transparent',
    textClass: 'text-muted-foreground',
    borderClass: 'border-transparent',
    needsAction: false,
  },
  CANCELLED: {
    label: 'Cancelled',
    dotColor: 'bg-zinc-400 dark:bg-zinc-600',
    bgClass: 'bg-transparent',
    textClass: 'text-muted-foreground',
    borderClass: 'border-transparent',
    needsAction: false,
  },
  WITHDRAWN: {
    label: 'Withdrawn',
    dotColor: 'bg-zinc-400 dark:bg-zinc-600',
    bgClass: 'bg-transparent',
    textClass: 'text-muted-foreground',
    borderClass: 'border-transparent',
    needsAction: false,
  },
  DISPUTED: {
    label: 'Disputed',
    dotColor: 'bg-purple-500',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-700 dark:text-purple-400',
    borderClass: 'border-purple-500/20',
    needsAction: true,
  },
  FAILED: {
    label: 'Failed',
    dotColor: 'bg-rose-500',
    bgClass: 'bg-rose-500/10',
    textClass: 'text-rose-700 dark:text-rose-400',
    borderClass: 'border-rose-500/20',
    needsAction: false,
  },
};

interface StatusBadgeProps {
  status: AnyStatus | string;
  className?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({
  status,
  className,
  size = 'md',
}: StatusBadgeProps) {
  const config = statusConfigMap[status] || {
    label: status,
    dotColor: 'bg-zinc-400',
    bgClass: 'bg-transparent',
    textClass: 'text-muted-foreground',
    borderClass: 'border-transparent',
    needsAction: false,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 select-none rounded-[4px] border text-xs',
        config.bgClass,
        config.textClass,
        config.borderClass,
        config.needsAction
          ? size === 'sm' ? 'px-1.5 py-0.5' : 'px-2 py-0.5'
          : 'border-transparent px-1 py-0.5',
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {config.needsAction && (
          <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', config.dotColor)} />
        )}
        <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', config.dotColor)} />
      </span>
      <span>{config.label}</span>
    </span>
  );
}
