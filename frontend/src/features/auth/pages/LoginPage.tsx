import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background">
      {/* Brand Panel: Flat dark neutral, no blur blobs, no gradients */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#111113] text-[#EDEDEF] p-10 flex-col justify-between border-r border-[#232326]">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="font-semibold text-base tracking-tight text-white">
              WorkCraft
            </span>
          </Link>
          <div className="mt-1 text-xs text-[#8E8E93] font-mono">
            Milestone Contract Workspace
          </div>
        </div>

        <div className="space-y-4 my-auto max-w-sm">
          <p className="text-xl font-medium leading-snug text-white">
            Contract directly with senior engineers. Escrow funds unlock milestone by milestone.
          </p>
          <ul className="space-y-2 text-xs text-[#8E8E93] pt-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8590C]" />
              <span>Full milestone-driven escrow protection</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8590C]" />
              <span>Payment releases strictly upon client deliverable approval</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8590C]" />
              <span>Standardized Indian Rupee (₹) contract terms</span>
            </li>
          </ul>
        </div>

        <div className="text-[11px] font-mono text-[#8E8E93]">
          API Gateway at :8080 • JWT 256-bit signed
        </div>
      </div>

      {/* Form Panel */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 md:px-16 py-12">
        <div className="w-full max-w-sm mx-auto space-y-6">
          <div className="lg:hidden flex items-center justify-between mb-2">
            <Link to="/" className="font-semibold text-base text-ink">
              WorkCraft
            </Link>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-ink">
              Sign in to WorkCraft
            </h1>
            <p className="text-xs text-muted-foreground">
              Access your contracts, open project listings, and milestone reviews.
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
            New to the marketplace?{' '}
            <Link
              to="/register"
              className="font-medium text-accent hover:underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
