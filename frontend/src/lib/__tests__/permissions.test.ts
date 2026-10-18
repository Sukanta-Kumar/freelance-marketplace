import { describe, it, expect } from 'vitest';
import { milestoneActions } from '../permissions';

describe('milestoneActions pure permissions function', () => {
  it('disallows all mutations if user is not an owner or role is missing', () => {
    const unauthActions = milestoneActions(null, 'PENDING', false);
    expect(unauthActions).toEqual({
      canStart: false,
      canSubmit: false,
      canResubmit: false,
      canApprove: false,
      canReject: false,
      canEdit: false,
    });

    const notOwnerActions = milestoneActions('FREELANCER', 'PENDING', false);
    expect(notOwnerActions.canStart).toBe(false);
  });

  describe('FREELANCER role permissions', () => {
    it('allows FREELANCER to start a milestone only when PENDING', () => {
      const pending = milestoneActions('FREELANCER', 'PENDING', true);
      expect(pending.canStart).toBe(true);
      expect(pending.canSubmit).toBe(false);
      expect(pending.canApprove).toBe(false);

      const inProgress = milestoneActions('FREELANCER', 'IN_PROGRESS', true);
      expect(inProgress.canStart).toBe(false);
    });

    it('allows FREELANCER to submit work only when IN_PROGRESS', () => {
      const inProgress = milestoneActions('FREELANCER', 'IN_PROGRESS', true);
      expect(inProgress.canSubmit).toBe(true);
      expect(inProgress.canStart).toBe(false);
      expect(inProgress.canApprove).toBe(false);
    });

    it('allows FREELANCER to resubmit when REJECTED', () => {
      const rejected = milestoneActions('FREELANCER', 'REJECTED', true);
      expect(rejected.canResubmit).toBe(true);
      expect(rejected.canStart).toBe(false);
      expect(rejected.canApprove).toBe(false);
    });

    it('never allows FREELANCER to approve or reject a milestone', () => {
      const submitted = milestoneActions('FREELANCER', 'SUBMITTED', true);
      expect(submitted.canApprove).toBe(false);
      expect(submitted.canReject).toBe(false);
    });
  });

  describe('CLIENT role permissions', () => {
    it('allows CLIENT to approve or reject milestone only when SUBMITTED', () => {
      const submitted = milestoneActions('CLIENT', 'SUBMITTED', true);
      expect(submitted.canApprove).toBe(true);
      expect(submitted.canReject).toBe(true);
      expect(submitted.canStart).toBe(false);
      expect(submitted.canSubmit).toBe(false);
    });

    it('allows CLIENT to edit milestone only when PENDING', () => {
      const pending = milestoneActions('CLIENT', 'PENDING', true);
      expect(pending.canEdit).toBe(true);
      expect(pending.canApprove).toBe(false);
      expect(pending.canReject).toBe(false);
    });

    it('never allows CLIENT to start or submit a milestone', () => {
      const inProgress = milestoneActions('CLIENT', 'IN_PROGRESS', true);
      expect(inProgress.canStart).toBe(false);
      expect(inProgress.canSubmit).toBe(false);
    });
  });

  describe('Terminal states', () => {
    it('disallows mutations once milestone is PAID or APPROVED', () => {
      const paidClient = milestoneActions('CLIENT', 'PAID', true);
      expect(paidClient.canApprove).toBe(false);
      expect(paidClient.canReject).toBe(false);

      const paidFreelancer = milestoneActions('FREELANCER', 'PAID', true);
      expect(paidFreelancer.canStart).toBe(false);
      expect(paidFreelancer.canSubmit).toBe(false);
    });
  });
});
