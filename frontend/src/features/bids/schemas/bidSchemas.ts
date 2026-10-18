import { z } from 'zod';

export const bidSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Quote amount is required' })
    .min(500, 'Quote must be at least ₹500')
    .max(10000000, 'Quote cannot exceed ₹1,00,00,000'),
  estimatedDays: z
    .number({ invalid_type_error: 'Estimated turnaround is required' })
    .int('Turnaround days must be a whole number')
    .min(1, 'Turnaround must be at least 1 day')
    .max(365, 'Turnaround cannot exceed 365 days'),
  proposal: z
    .string()
    .min(20, 'Proposal must be at least 20 characters explaining your approach')
    .max(2000, 'Proposal cannot exceed 2000 characters'),
});

export type BidFormValues = z.infer<typeof bidSchema>;
