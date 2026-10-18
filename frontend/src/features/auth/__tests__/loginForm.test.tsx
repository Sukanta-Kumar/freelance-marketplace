import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

// Wrap with router context for useNavigate
function renderLoginForm() {
  return render(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  );
}

describe('LoginForm validation and interactions', () => {
  it('renders all form fields and submit button', () => {
    renderLoginForm();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Sign in to your account/i })
    ).toBeInTheDocument();
  });

  it('displays inline validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const submitBtn = screen.getByRole('button', { name: /Sign in to your account/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it('validates invalid email format and short password', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole('button', { name: /Sign in to your account/i });

    await user.type(emailInput, 'notanemail');
    await user.type(passwordInput, '123');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('autofills credentials when clicking quick-fill demo button', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const clientAutofill = screen.getByRole('button', { name: /Client \(Rahul\)/i });
    await user.click(clientAutofill);

    const emailInput = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    expect(emailInput.value).toBe('client@workcraft.io');
  });
});
