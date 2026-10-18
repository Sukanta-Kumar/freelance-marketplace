import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useAuthStore } from '@/stores/authStore';

export function PublicLayout() {
  const { isAuthenticated, role } = useAuthStore();
  const dashboardLink = role === 'ADMIN' ? '/admin' : '/dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-background text-ink font-sans">
      {/* Public Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur-[2px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-13 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-ink">
              WorkCraft
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-xs text-muted-foreground font-medium">
            <a href="#how-it-works" className="hover:text-ink transition-colors">
              How it works
            </a>
            <a href="#escrow" className="hover:text-ink transition-colors">
              Milestone Escrow
            </a>
            <Link to="/browse" className="hover:text-ink transition-colors">
              Browse Projects
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button asChild size="sm">
                <Link to={dashboardLink}>Open Workspace</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild variant="accent" size="sm">
                  <Link to="/register">Create Account</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-border bg-surface py-8 px-4 sm:px-6 text-xs text-muted-foreground">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-medium text-ink">WorkCraft</span> — Milestone-driven freelance marketplace in Indian Rupees (₹).
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span>Spring Boot Gateway (:8080)</span>
            <span>•</span>
            <span>JWT Auth</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
