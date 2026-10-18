import { describe, it, expect } from 'vitest';
import { bidSchema } from '../schemas/bidSchemas';

describe('Bid Zod Schema Validation', () => {
  it('passes validation with valid proposal inputs', () => {
    const validData = {
      amount: 45000,
      estimatedDays: 14,
      proposal: 'Will implement responsive components and full API integration with E2E tests.',
    };

    const result = bidSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails when quote amount is below minimum threshold', () => {
    const invalidData = {
      amount: 200,
      estimatedDays: 7,
      proposal: 'Will implement responsive components and full API integration with E2E tests.',
    };

    const result = bidSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/Quote must be at least ₹500/i);
    }
  });

  it('fails when turnaround days is not a positive integer', () => {
    const invalidData = {
      amount: 15000,
      estimatedDays: 0,
      proposal: 'Will implement responsive components and full API integration with E2E tests.',
    };

    const result = bidSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/Turnaround must be at least 1 day/i);
    }
  });

  it('fails when proposal text is under 20 characters', () => {
    const invalidData = {
      amount: 25000,
      estimatedDays: 10,
      proposal: 'Too short',
    };

    const result = bidSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/Proposal must be at least 20 characters/i);
    }
  });

  it('fails when proposal exceeds 2000 characters', () => {
    const invalidData = {
      amount: 50000,
      estimatedDays: 20,
      proposal: 'a'.repeat(2001),
    };

    const result = bidSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/Proposal cannot exceed 2000 characters/i);
    }
  });
});
