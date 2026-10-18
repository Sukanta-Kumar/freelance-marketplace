import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ProjectForm } from '../components/ProjectForm';

function renderProjectForm(onSubmit = vi.fn()) {
  return render(
    <BrowserRouter>
      <ProjectForm onSubmit={onSubmit} />
    </BrowserRouter>
  );
}

describe('ProjectForm component and interactions', () => {
  it('renders all required form controls', () => {
    renderProjectForm();
    expect(screen.getByLabelText(/Project Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Technical Specification & Scope/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Project Budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Completion Deadline/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Publish Project/i })).toBeInTheDocument();
  });

  it('shows validation errors when title is too short', async () => {
    const user = userEvent.setup();
    renderProjectForm();

    const titleInput = screen.getByLabelText(/Project Title/i);
    const submitBtn = screen.getByRole('button', { name: /Publish Project/i });

    await user.clear(titleInput);
    await user.type(titleInput, 'ABC');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Title must be at least 5 characters/i)).toBeInTheDocument();
    });
  });

  it('updates budget input and formatted preview when clicking budget preset chip', async () => {
    const user = userEvent.setup();
    renderProjectForm();

    const preset200k = screen.getByRole('button', { name: /₹2,00,000/i });
    await user.click(preset200k);

    const budgetInput = screen.getByLabelText(/Project Budget/i) as HTMLInputElement;
    expect(budgetInput.value).toBe('200000');
  });
});
