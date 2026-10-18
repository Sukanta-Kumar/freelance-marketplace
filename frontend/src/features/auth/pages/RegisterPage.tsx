import React from 'react';
import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';

export default function RegisterPage() {
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
            Engineering contracts backed by sequential escrow milestones.
          </p>
          <ul className="space-y-2 text-xs text-[#8E8E93] pt-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8590C]" />
              <span>For Clients: Compare bids and pay only for approved deliverables</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8590C]" />
              <span>For Freelancers: Guaranteed payouts locked in escrow before starting</span>
            </li>
          </ul>
        </div>

        <div className="text-[11px] font-mono text-[#8E8E93]">
          India • Denominated in INR (₹)
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
              Create an account
            </h1>
            <p className="text-xs text-muted-foreground">
              Select your primary workspace role to start contracting.
            </p>
          </div>

          <RegisterForm />

          <p className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-accent hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
