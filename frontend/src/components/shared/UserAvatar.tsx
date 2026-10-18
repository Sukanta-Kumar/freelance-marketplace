import React from 'react';
import { cn } from '@/lib/cn';

interface UserAvatarProps {
  name?: string | null;
  email?: string | null;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  xs: 'w-5 h-5 text-[9px]',
  sm: 'w-7 h-7 text-xs',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-12 h-12 text-base',
};

export function getInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    return email.slice(0, 2).toUpperCase();
  }
  return '—';
}

export function UserAvatar({
  name,
  email,
  className,
  size = 'md',
}: UserAvatarProps) {
  const initials = getInitials(name, email);

  return (
    <div
      aria-label={name || email || 'User Avatar'}
      className={cn(
        'rounded-full flex items-center justify-center font-mono font-medium select-none shrink-0 border border-border bg-subtle text-ink',
        sizeClasses[size],
        className
      )}
    >
      <span>{initials}</span>
    </div>
  );
}
