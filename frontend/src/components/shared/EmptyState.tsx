import React from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
  children,
}: EmptyStateProps) {
  // Use one line of plain text as specified by Quiet Utility design rules
  const message = description || title || 'No items available.';

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-lg border border-border bg-surface text-left my-3',
        className
      )}
    >
      <p className="text-xs sm:text-sm text-muted-foreground">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm" className="shrink-0">
          {actionLabel}
        </Button>
      )}
      {children}
    </div>
  );
}
