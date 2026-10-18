import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AppShell } from '@/layouts/AppShell';
import { ProtectedRoute } from './ProtectedRoute';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy-loaded page components
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const DashboardDispatcher = lazy(() => import('@/pages/DashboardDispatcher'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ContractWorkspacePage = lazy(() => import('@/pages/ContractWorkspacePage'));

// Projects Feature Pages
const MyProjectsPage = lazy(() => import('@/features/projects/pages/MyProjectsPage'));
const CreateProjectPage = lazy(() => import('@/features/projects/pages/CreateProjectPage'));
const EditProjectPage = lazy(() => import('@/features/projects/pages/EditProjectPage'));
const BrowseProjectsPage = lazy(() => import('@/features/projects/pages/BrowseProjectsPage'));
const ProjectDetailPage = lazy(() => import('@/features/projects/pages/ProjectDetailPage'));

// Bids Feature Pages
const MyBidsPage = lazy(() => import('@/features/bids/pages/MyBidsPage'));

// Contracts Feature Pages
const ContractsListPage = lazy(() => import('@/features/contracts/pages/ContractsListPage'));

// Fallback skeleton loader during lazy loading
function PageLoader() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Skeleton className="h-10 w-64 rounded-md" />
      <Skeleton className="h-5 w-96 rounded-md" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Skeleton className="h-32 rounded-card" />
        <Skeleton className="h-32 rounded-card" />
        <Skeleton className="h-32 rounded-card" />
      </div>
      <Skeleton className="h-64 rounded-card pt-4" />
    </div>
  );
}

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // Public Route Tree
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: withSuspense(LandingPage),
      },
      {
        path: 'browse',
        element: withSuspense(BrowseProjectsPage),
      },
    ],
  },
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/register',
    element: withSuspense(RegisterPage),
  },
  {
    path: '/403',
    element: withSuspense(ForbiddenPage),
  },

  // Authenticated AppShell Route Tree
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: '/dashboard',
            element: withSuspense(DashboardDispatcher),
          },
          {
            path: '/profile',
            element: withSuspense(ProfilePage),
          },

          // Projects Management
          {
            path: '/projects',
            element: withSuspense(MyProjectsPage),
          },
          {
            element: <ProtectedRoute allowedRoles={['CLIENT']} />,
            children: [
              {
                path: '/projects/new',
                element: withSuspense(CreateProjectPage),
              },
              {
                path: '/projects/:id/edit',
                element: withSuspense(EditProjectPage),
              },
            ],
          },
          {
            path: '/projects/:id',
            element: withSuspense(ProjectDetailPage),
          },
          {
            path: '/browse',
            element: withSuspense(BrowseProjectsPage),
          },

          // Dedicated Admin Guarded Route
          {
            element: <ProtectedRoute allowedRoles={['ADMIN']} />,
            children: [
              {
                path: '/admin',
                element: withSuspense(DashboardDispatcher),
              },
              {
                path: '/admin/freelancers',
                element: withSuspense(DashboardDispatcher),
              },
              {
                path: '/admin/projects',
                element: withSuspense(DashboardDispatcher),
              },
            ],
          },

          // Fallbacks for Phase 4 & Phase 5
          {
            path: '/my-bids',
            element: withSuspense(MyBidsPage),
          },
          {
            path: '/contracts',
            element: withSuspense(ContractsListPage),
          },
          {
            path: '/contracts/:id',
            element: withSuspense(ContractWorkspacePage),
          },
        ],
      },
    ],
  },

  // 404 Catch-All
  {
    path: '*',
    element: withSuspense(NotFoundPage),
  },
]);
