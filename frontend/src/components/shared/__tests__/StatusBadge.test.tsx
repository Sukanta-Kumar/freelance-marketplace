import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { StatusBadge, statusConfigMap } from '../StatusBadge';

describe('StatusBadge component and mapping', () => {
  it('maps all major domain statuses accurately', () => {
    expect(statusConfigMap.SUBMITTED.label).toBe('Awaiting Review');
    expect(statusConfigMap.PAID.label).toBe('Paid');
    expect(statusConfigMap.REJECTED.label).toBe('Needs Revision');
    expect(statusConfigMap.OPEN.label).toBe('Open');
    expect(statusConfigMap.IN_PROGRESS.label).toBe('In Progress');
    expect(statusConfigMap.COMPLETED.label).toBe('Completed');
  });

  it('renders status label for SUBMITTED with pulsating indicator', () => {
    const { container } = render(<StatusBadge status="SUBMITTED" />);
    expect(screen.getByText('Awaiting Review')).toBeInTheDocument();
    // Verify ping animation element exists for actionable state
    const pingEl = container.querySelector('.animate-ping');
    expect(pingEl).toBeInTheDocument();
  });

  it('renders status label for PAID without pulsating indicator', () => {
    const { container } = render(<StatusBadge status="PAID" />);
    expect(screen.getByText('Paid')).toBeInTheDocument();
    const pingEl = container.querySelector('.animate-ping');
    expect(pingEl).not.toBeInTheDocument();
  });

  it('renders gracefully for unknown or raw status strings', () => {
    render(<StatusBadge status="UNKNOWN_STATE" />);
    expect(screen.getByText('UNKNOWN_STATE')).toBeInTheDocument();
  });
});
