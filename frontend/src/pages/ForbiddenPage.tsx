import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';

export default function ForbiddenPage() {
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);

  const homePath = role === 'ADMIN' ? '/admin' : '/dashboard';

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-card border border-border bg-surface shadow-soft">
        <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-pill bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
            Access Restricted • 403
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink pt-1">
            Permission Required
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You don't have permission to access this area. This workspace view is reserved for a different account role.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link to={homePath}>
              <Home className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
