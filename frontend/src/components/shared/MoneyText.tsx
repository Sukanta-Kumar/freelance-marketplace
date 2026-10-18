import React from 'react';
import { cn } from '@/lib/cn';
import { formatINR } from '@/lib/format';

interface MoneyTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: number | string | null | undefined;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  trend?: 'neutral' | 'positive' | 'negative';
}

const sizeClasses = {
  xs: 'text-xs font-mono font-medium',
  sm: 'text-xs font-mono font-semibold',
  md: 'text-sm font-mono font-semibold',
  lg: 'text-base font-mono font-semibold tracking-tight',
  xl: 'text-lg sm:text-xl font-mono font-semibold tracking-tight',
  hero: 'text-2xl sm:text-3xl font-mono font-semibold tracking-tight',
};

const trendClasses = {
  neutral: 'text-ink',
  positive: 'text-emerald-600 dark:text-emerald-400',
  negative: 'text-rose-600 dark:text-rose-400',
};

export function MoneyText({
  amount,
  size = 'md',
  trend = 'neutral',
  className,
  ...props
}: MoneyTextProps) {
  const formatted = formatINR(amount);

  return (
    <span
      className={cn(
        'tabular-nums inline-flex items-baseline',
        sizeClasses[size],
        trendClasses[trend],
        className
      )}
      {...props}
    >
      {formatted}
    </span>
  );
}
