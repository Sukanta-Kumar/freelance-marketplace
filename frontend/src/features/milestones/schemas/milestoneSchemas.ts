import { z } from 'zod';

export const createMilestoneSchema = z.object({
  title: z
    .string()
    .min(5, 'Milestone title must be at least 5 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  description: z
    .string()
    .min(10, 'Specification must be at least 10 characters')
    .max(2000, 'Specification cannot exceed 2000 characters'),
  amount: z
    .number({ invalid_type_error: 'Amount is required' })
    .min(500, 'Milestone amount must be at least ₹500'),
  dueDate: z.string().optional(),
});

export type CreateMilestoneFormValues = z.infer<typeof createMilestoneSchema>;

export const submitDeliverableSchema = z.object({
  deliverableUrl: z
    .string()
    .url('Please enter a valid URL (e.g. GitHub PR, Figma preview, Vercel deployment)'),
  description: z
    .string()
    .min(10, 'Release notes must be at least 10 characters explaining your changes')
    .max(2000, 'Release notes cannot exceed 2000 characters'),
});

export type SubmitDeliverableFormValues = z.infer<typeof submitDeliverableSchema>;

export const rejectDeliverableSchema = z.object({
  reason: z
    .string()
    .min(10, 'Please provide specific feedback of at least 10 characters')
    .max(1000, 'Feedback cannot exceed 1000 characters'),
});

export type RejectDeliverableFormValues = z.infer<typeof rejectDeliverableSchema>;
