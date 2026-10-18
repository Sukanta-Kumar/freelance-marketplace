import { describe, it, expect } from 'vitest';
import {
  createMilestoneSchema,
  submitDeliverableSchema,
  rejectDeliverableSchema,
} from '../schemas/milestoneSchemas';
import { milestoneActions } from '@/lib/permissions';

describe('Milestone Schemas Validation', () => {
  describe('createMilestoneSchema', () => {
    it('validates a correct milestone payload', () => {
      const valid = {
        title: 'Backend API & GraphQL resolvers',
        description: 'Complete endpoints for user auth, projects listing, and schema migrations.',
        amount: 25000,
        dueDate: '2026-11-15',
      };
      const result = createMilestoneSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('fails when title is too short', () => {
      const invalid = {
        title: 'API',
        description: 'Complete endpoints for user auth, projects listing, and schema migrations.',
        amount: 25000,
      };
      const result = createMilestoneSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 5 characters');
      }
    });

    it('fails when amount is less than 500', () => {
      const invalid = {
        title: 'Backend API setup',
        description: 'Complete endpoints for user auth, projects listing, and schema migrations.',
        amount: 400,
      };
      const result = createMilestoneSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least ₹500');
      }
    });

    it('fails when description is too short', () => {
      const invalid = {
        title: 'Backend API setup',
        description: 'Too short',
        amount: 15000,
      };
      const result = createMilestoneSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 10 characters');
      }
    });
  });

  describe('submitDeliverableSchema', () => {
    it('accepts a valid repository URL and release notes', () => {
      const valid = {
        deliverableUrl: 'https://github.com/client/repo/pull/42',
        description: 'Implemented Apollo client and validated catalog queries with test fixtures.',
      };
      const result = submitDeliverableSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects an invalid URL format', () => {
      const invalid = {
        deliverableUrl: 'not-a-valid-url',
        description: 'Implemented Apollo client and validated catalog queries with test fixtures.',
      };
      const result = submitDeliverableSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid URL');
      }
    });

    it('rejects notes under 10 characters', () => {
      const invalid = {
        deliverableUrl: 'https://github.com/client/repo/pull/42',
        description: 'Done.',
      };
      const result = submitDeliverableSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 10 characters');
      }
    });
  });

  describe('rejectDeliverableSchema', () => {
    it('accepts constructive revision feedback', () => {
      const valid = {
        reason: 'Please update test coverage to exceed 90% and fix mobile breakpoint on iPhone 14.',
      };
      const result = rejectDeliverableSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects vague feedback under 10 characters', () => {
      const invalid = {
        reason: 'Fix this',
      };
      const result = rejectDeliverableSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 10 characters');
      }
    });
  });
});

describe('Milestone Lifecycle Transitions & Permissions', () => {
  it('allows freelancer to start only when PENDING', () => {
    const pendingActions = milestoneActions('FREELANCER', 'PENDING', true);
    expect(pendingActions.canStart).toBe(true);
    expect(pendingActions.canSubmit).toBe(false);
    expect(pendingActions.canApprove).toBe(false);

    const inProgressActions = milestoneActions('FREELANCER', 'IN_PROGRESS', true);
    expect(inProgressActions.canStart).toBe(false);
    expect(inProgressActions.canSubmit).toBe(true);
  });

  it('allows freelancer to resubmit when REJECTED', () => {
    const rejectedActions = milestoneActions('FREELANCER', 'REJECTED', true);
    expect(rejectedActions.canResubmit).toBe(true);
    expect(rejectedActions.canStart).toBe(false);
    expect(rejectedActions.canApprove).toBe(false);
  });

  it('allows client to approve or reject only when SUBMITTED', () => {
    const submittedActions = milestoneActions('CLIENT', 'SUBMITTED', true);
    expect(submittedActions.canApprove).toBe(true);
    expect(submittedActions.canReject).toBe(true);
    expect(submittedActions.canStart).toBe(false);
    expect(submittedActions.canSubmit).toBe(false);

    const paidActions = milestoneActions('CLIENT', 'PAID', true);
    expect(paidActions.canApprove).toBe(false);
    expect(paidActions.canReject).toBe(false);
  });

  it('disallows non-parties from performing any transition', () => {
    const strangerActions = milestoneActions('FREELANCER', 'PENDING', false);
    expect(strangerActions.canStart).toBe(false);
    expect(strangerActions.canSubmit).toBe(false);
    expect(strangerActions.canApprove).toBe(false);
  });
});
