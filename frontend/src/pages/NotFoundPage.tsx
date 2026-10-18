import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-card border border-border bg-surface shadow-soft">
        <div className="w-16 h-16 rounded-full bg-muted/60 text-muted-foreground mx-auto flex items-center justify-center">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="font-serif text-5xl font-bold tracking-tight text-primary block">
            404
          </span>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-ink">
            Page Not Found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The project, milestone, or workspace link you're looking for might have been moved or doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Marketplace Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
