import { format, parseISO, isValid } from 'date-fns';

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/**
 * Format an amount in Indian Rupees (₹)
 * Example: 25000 -> "₹25,000"
 */
export function formatINR(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') return '₹0';
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numeric)) return '₹0';
  return inrFormatter.format(numeric);
}

/**
 * Format a numeric value without the currency symbol (for inputs or raw counts)
 */
export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '0';
  const numeric = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numeric)) return '0';
  return new Intl.NumberFormat('en-IN').format(numeric);
}

/**
 * Format date string or Date object to human readable string (e.g., "14 Oct 2026")
 */
export function formatDate(dateInput: string | Date | null | undefined, pattern = 'dd MMM yyyy'): string {
  if (!dateInput) return '—';
  try {
    const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (!isValid(d)) return '—';
    return format(d, pattern);
  } catch {
    return '—';
  }
}

/**
 * Format date with time (e.g., "14 Oct 2026, 04:30 PM")
 */
export function formatDateTime(dateInput: string | Date | null | undefined): string {
  return formatDate(dateInput, 'dd MMM yyyy, hh:mm a');
}
