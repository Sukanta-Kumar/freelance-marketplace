import { describe, it, expect } from 'vitest';
import { projectSchema } from '../schemas/projectSchemas';

describe('Project Zod Schema Validation', () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const validDeadline = tomorrow.toISOString().split('T')[0];

  it('validates correct project input', () => {
    const validData = {
      title: 'Spring Cloud Microservices Integration',
      description:
        'Architecting resilient distributed event-driven microservices with Redis and Kafka.',
      budget: 85000,
      deadline: validDeadline,
    };

    const result = projectSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects title shorter than 5 characters', () => {
    const invalidData = {
      title: 'App',
      description: 'Long enough description for testing project scope and requirements.',
      budget: 50000,
      deadline: validDeadline,
    };

    const result = projectSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 5 characters');
    }
  });

  it('rejects description shorter than 20 characters', () => {
    const invalidData = {
      title: 'Valid Project Title',
      description: 'Too short.',
      budget: 50000,
      deadline: validDeadline,
    };

    const result = projectSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('min 20 characters');
    }
  });

  it('rejects budget below ₹1,000', () => {
    const invalidData = {
      title: 'Valid Project Title',
      description: 'Valid long description for testing system architecture specifications.',
      budget: 500,
      deadline: validDeadline,
    };

    const result = projectSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Minimum budget is ₹1,000');
    }
  });

  it('rejects past deadline dates', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 2);
    const pastDeadline = yesterday.toISOString().split('T')[0];

    const invalidData = {
      title: 'Valid Project Title',
      description: 'Valid long description for testing system architecture specifications.',
      budget: 50000,
      deadline: pastDeadline,
    };

    const result = projectSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Deadline must be today or a future date');
    }
  });
});
