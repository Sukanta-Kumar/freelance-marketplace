import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';

describe('ProtectedRoute role guard and session security', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      user: null,
      userId: null,
      role: null,
      isAuthenticated: false,
    });
  });

  it('redirects unauthenticated users to /login', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Login Page Screen</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Secret Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page Screen')).toBeInTheDocument();
    expect(screen.queryByText('Secret Dashboard')).not.toBeInTheDocument();
  });

  it('allows authenticated users to access protected routes', () => {
    useAuthStore.setState({
      token: 'valid.mock.token',
      userId: 1,
      role: 'CLIENT',
      isAuthenticated: true,
      checkTokenValidity: () => true,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Secret Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Secret Dashboard')).toBeInTheDocument();
  });

  it('redirects authenticated user to /403 when role is not permitted', () => {
    useAuthStore.setState({
      token: 'valid.mock.token',
      userId: 2,
      role: 'FREELANCER',
      isAuthenticated: true,
      checkTokenValidity: () => true,
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/403" element={<div>403 Forbidden Screen</div>} />
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<div>Admin Console</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('403 Forbidden Screen')).toBeInTheDocument();
    expect(screen.queryByText('Admin Console')).not.toBeInTheDocument();
  });
});
