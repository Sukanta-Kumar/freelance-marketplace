import { z } from 'zod';

export const projectSchema = z.object({
  title: z
    .string()
    .min(1, 'Project title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(20, 'Please provide a detailed description (min 20 characters)')
    .max(3000, 'Description cannot exceed 3000 characters'),
  budget: z
    .coerce
    .number({ invalid_type_error: 'Please enter a valid budget' })
    .min(1000, 'Minimum budget is ₹1,000')
    .max(10000000, 'Budget exceeds maximum permitted amount'),
  deadline: z
    .string()
    .min(1, 'Target deadline is required')
    .refine((dateStr) => {
      const selected = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, 'Deadline must be today or a future date'),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
