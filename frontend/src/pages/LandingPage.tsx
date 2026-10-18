import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyText } from '@/components/shared/MoneyText';

export default function LandingPage() {
  return (
    <div className="space-y-16 pb-16 pt-8 sm:pt-14 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Hero Section: Left-aligned, plain, specific, honest */}
      <section className="space-y-4 max-w-3xl">
        <div className="inline-block text-[11px] font-mono uppercase tracking-wider text-muted-foreground border border-border px-2 py-0.5 rounded">
          Milestone Contract Engine
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-ink leading-[1.15]">
          Post a project. Pick a freelancer. Pay per milestone, only after you approve the work.
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
          An engineering workspace where contract funds stay locked in escrow until deliverables pass review. Zero upfront risk for clients, guaranteed payouts for freelancers.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button asChild variant="accent" size="lg">
            <Link to="/register">Post a Project</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/browse">Browse Open Work</Link>
          </Button>
        </div>
      </section>

      {/* Real Contract Workspace Preview Card */}
      <section className="space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          Live Contract Structure
        </div>
        <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-ink">
                  Shopify store migration to Next.js storefront
                </span>
                <StatusBadge status="ACTIVE" size="sm" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Contract #104 • Client: Vikram Malhotra • Engineer: Priya Patel
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] font-mono uppercase text-muted-foreground block">
                Total Escrow
              </span>
              <MoneyText amount={84500} size="lg" className="font-bold text-ink" />
            </div>
          </div>

          {/* Minimal 3-node Milestone Rail */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>Milestones (1 paid, 1 in review, 1 remaining)</span>
              <span>₹24,500 of ₹84,500 released</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded border border-border bg-subtle/50 text-xs space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-muted-foreground">#1 Schema & API</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">● Paid</span>
                </div>
                <MoneyText amount={24500} size="sm" />
              </div>

              <div className="p-3 rounded border border-amber-500/30 bg-amber-500/5 text-xs space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-amber-700 dark:text-amber-400 font-medium">#2 Cart & Checkout</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">● In Review</span>
                </div>
                <MoneyText amount={35000} size="sm" />
              </div>

              <div className="p-3 rounded border border-border bg-surface text-xs space-y-1 opacity-75">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-muted-foreground">#3 Web Vitals & Cutover</span>
                  <span className="text-muted-foreground">● Pending</span>
                </div>
                <MoneyText amount={25000} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process: Dense hairline table/list pattern */}
      <section id="how-it-works" className="space-y-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            The Flow
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-ink mt-0.5">
            How contracts execute
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-lg border border-border bg-surface space-y-1.5">
            <span className="font-mono text-xs font-semibold text-accent">01</span>
            <h3 className="text-sm font-semibold text-ink">Post Specification</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Describe deliverables, budget in INR (₹), and target completion deadline.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border bg-surface space-y-1.5">
            <span className="font-mono text-xs font-semibold text-accent">02</span>
            <h3 className="text-sm font-semibold text-ink">Accept Proposal</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Compare estimates and turnaround times. Accepting a bid creates an active contract.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border bg-surface space-y-1.5">
            <span className="font-mono text-xs font-semibold text-accent">03</span>
            <h3 className="text-sm font-semibold text-ink">Submit Deliverables</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Engineers work milestone by milestone, submitting GitHub PRs or verified builds.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border bg-surface space-y-1.5">
            <span className="font-mono text-xs font-semibold text-accent">04</span>
            <h3 className="text-sm font-semibold text-ink">Approve & Release</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Review work before approving. Approval triggers automated ledger payment.
            </p>
          </div>
        </div>
      </section>

      {/* Escrow Terms Notice */}
      <section id="escrow" className="p-5 rounded-lg border border-border bg-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <h3 className="text-sm font-semibold text-ink">
            Guaranteed milestone protection
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Freelancers never begin work without contract-backed escrow. Clients never pay for incomplete milestones.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button asChild variant="default" size="sm">
            <Link to="/register">Create Account</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/browse">View Projects</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
