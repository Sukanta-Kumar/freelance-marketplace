import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyText } from '@/components/shared/MoneyText';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlusCircle, Compass } from 'lucide-react';

export default function DashboardDispatcher() {
  const { user, role } = useAuthStore();
  const isClient = role === 'CLIENT';

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Dashboard — ${user?.fullName || 'Partner'}`}
        description={
          isClient
            ? 'Manage active project listings, review proposals, and approve milestone payouts.'
            : 'Track deliverables in progress, upcoming deadlines, and contract earnings.'
        }
        badge={<StatusBadge status={role || 'CLIENT'} size="sm" />}
        actions={
          isClient ? (
            <Button asChild variant="accent" size="sm">
              <Link to="/projects/new">
                <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                Post Project
              </Link>
            </Button>
          ) : (
            <Button asChild variant="accent" size="sm">
              <Link to="/browse">
                <Compass className="w-3.5 h-3.5 mr-1.5" />
                Browse Projects
              </Link>
            </Button>
          )
        }
      />

      {/* Signature UI: "Needs Your Action" Strip (Linear-style alert card) */}
      <div className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-ink flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <div>
            <div className="text-xs font-semibold text-ink">
              {isClient
                ? '1 milestone deliverable awaiting review'
                : 'Milestone 3 in progress: Lighthouse optimization & cutover'}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {isClient
                ? 'Shopify store migration — Milestone #2 submitted by Priya Patel (₹35,000)'
                : 'Target delivery deadline on 15 Nov 2026 (₹25,000)'}
            </p>
          </div>
        </div>

        <Button asChild size="sm" variant="outline" className="shrink-0 h-7 text-xs">
          <Link to="/contracts/1">
            <span>Review deliverable</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </Button>
      </div>

      {/* Stats: ONE horizontal strip separated by vertical dividers, NO icons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 rounded-lg border border-border bg-surface divide-y sm:divide-y-0 sm:divide-x divide-border">
        <div className="p-3.5 sm:p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            {isClient ? 'Total In Escrow' : 'Total Earnings'}
          </div>
          <div className="mt-1">
            <MoneyText amount={isClient ? 84500 : 24500} size="xl" className="font-bold text-ink" />
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {isClient ? 'Across 1 active contract' : '1 milestone paid'}
          </div>
        </div>

        <div className="p-3.5 sm:p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            {isClient ? 'Open Projects' : 'Active Contracts'}
          </div>
          <div className="mt-1 font-mono text-xl sm:text-2xl font-bold text-ink tabular-nums">
            {isClient ? '3' : '1'}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {isClient ? 'Accepting bids' : 'In execution'}
          </div>
        </div>

        <div className="p-3.5 sm:p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            {isClient ? 'Pending Bids' : 'Submitted Bids'}
          </div>
          <div className="mt-1 font-mono text-xl sm:text-2xl font-bold text-ink tabular-nums">
            {isClient ? '2' : '2'}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            Awaiting decision
          </div>
        </div>

        <div className="p-3.5 sm:p-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Paid Milestones
          </div>
          <div className="mt-1 font-mono text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            1
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            Verified & settled
          </div>
        </div>
      </div>

      {/* Main Content: Hairline divided list / table instead of card grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Left: Active Contracts & Projects (2 columns) */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-border/80">
            <span className="text-xs font-semibold text-ink">Active Work</span>
            <Link to="/contracts" className="text-xs text-muted-foreground hover:text-ink">
              View all
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-surface divide-y divide-border">
            <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-subtle/50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Link to="/contracts/1" className="text-sm font-semibold text-ink hover:underline">
                    Shopify store migration to Next.js storefront
                  </Link>
                  <StatusBadge status="ACTIVE" size="sm" />
                </div>
                <div className="text-xs text-muted-foreground">
                  Contract #1 • Engineer: Priya Patel • Target: 20 Nov 2026
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <MoneyText amount={84500} size="sm" className="font-semibold text-ink" />
                <Button asChild variant="outline" size="sm" className="h-7 text-xs">
                  <Link to="/contracts/1">Workspace</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Activity log / Recent events (1 column) */}
        <div className="space-y-3">
          <div className="pb-1 border-b border-border/80">
            <span className="text-xs font-semibold text-ink">Recent Events</span>
          </div>

          <div className="rounded-lg border border-border bg-surface p-3.5 space-y-3 text-xs">
            <div className="space-y-1 pb-2.5 border-b border-border/60">
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink">Milestone #2 Submitted</span>
                <span className="text-[10px] font-mono text-muted-foreground">Today</span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Priya Patel submitted deliverable for review (₹35,000).
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink">Payment Released</span>
                <span className="text-[10px] font-mono text-muted-foreground">02 Oct</span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                ₹24,500 transferred for Milestone #1 completion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
