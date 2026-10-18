import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMyBids, useWithdrawBid } from '../hooks/useBids';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { BidResponse, ProjectResponse } from '@/types/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyText } from '@/components/shared/MoneyText';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EditBidDialog } from '../components/EditBidDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/format';
import {
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Compass,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

const statusTabs = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export default function MyBidsPage() {
  const { data: bids = [], isLoading: bidsLoading, isError: bidsError, refetch } = useMyBids();
  const { data: projects = [] } = useProjects();
  const withdrawMutation = useWithdrawBid();

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingBid, setEditingBid] = useState<BidResponse | null>(null);
  const [withdrawingBid, setWithdrawingBid] = useState<BidResponse | null>(null);

  // Map projectId to Project title
  const projectMap = useMemo(() => {
    const map = new Map<number, ProjectResponse>();
    projects.forEach((p) => map.set(p.id, p));
    return map;
  }, [projects]);

  // Filter bids by active tab and search query
  const filteredBids = useMemo(() => {
    return bids.filter((bid) => {
      const matchesTab = activeTab === 'ALL' || bid.status === activeTab;
      const project = projectMap.get(bid.projectId);
      const matchesSearch =
        (project?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        bid.proposal.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [bids, activeTab, searchQuery, projectMap]);

  const handleWithdrawConfirm = async () => {
    if (!withdrawingBid) return;
    await withdrawMutation.mutateAsync(withdrawingBid.id);
    setWithdrawingBid(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Proposals"
        description="Active proposals and contract quotes submitted across marketplace engineering projects."
        actions={
          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link to="/browse">
              <Compass className="w-3.5 h-3.5 mr-1.5" />
              Browse open projects
            </Link>
          </Button>
        }
      />

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {statusTabs.map((tab) => {
            const count =
              tab.value === 'ALL'
                ? bids.length
                : bids.filter((b) => b.status === tab.value).length;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-badge text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.value
                    ? 'bg-ink text-surface'
                    : 'text-muted-foreground hover:text-ink hover:bg-muted'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-mono tabular-nums ${
                    activeTab === tab.value ? 'text-surface/80' : 'text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Filter */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter proposals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Loading Skeletons */}
      {bidsLoading && (
        <div className="space-y-2">
          <Skeleton className="h-12 rounded-card" />
          <Skeleton className="h-12 rounded-card" />
          <Skeleton className="h-12 rounded-card" />
        </div>
      )}

      {/* Error State */}
      {bidsError && (
        <div className="p-4 rounded-card border border-destructive/20 bg-rose-50/20 text-center space-y-2">
          <div className="flex items-center justify-center text-destructive text-xs font-medium gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Failed to load proposal records</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="h-7 text-xs">
            <RefreshCw className="w-3 h-3 mr-1.5" />
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!bidsLoading && !bidsError && filteredBids.length === 0 && (
        <EmptyState
          title={searchQuery ? 'No matching proposals found' : 'No proposals submitted yet'}
          description={
            searchQuery
              ? `No proposals matched "${searchQuery}".`
              : 'Explore open projects on the marketplace to submit your first milestone proposal.'
          }
          actionLabel={searchQuery ? 'Clear filter' : 'Browse open projects'}
          onAction={searchQuery ? () => setSearchQuery('') : undefined}
        />
      )}

      {/* Hairline Data Table */}
      {!bidsLoading && !bidsError && filteredBids.length > 0 && (
        <div className="border border-border rounded-card overflow-hidden bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-mono uppercase text-[11px] tracking-wider select-none">
                <tr>
                  <th className="py-2.5 px-4 font-normal">Project Brief</th>
                  <th className="py-2.5 px-3 font-normal">Proposal Summary</th>
                  <th className="py-2.5 px-3 font-normal text-right">Quote</th>
                  <th className="py-2.5 px-3 font-normal text-right">Days</th>
                  <th className="py-2.5 px-3 font-normal">Status</th>
                  <th className="py-2.5 px-3 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBids.map((bid) => {
                  const project = projectMap.get(bid.projectId);
                  const isPending = bid.status === 'PENDING';
                  const isAccepted = bid.status === 'ACCEPTED';

                  return (
                    <tr key={bid.id} className="hover:bg-muted/20 transition-colors h-12">
                      <td className="py-2.5 px-4 max-w-xs">
                        <Link
                          to={`/projects/${bid.projectId}`}
                          className="font-medium text-ink hover:text-accent transition-colors block truncate"
                        >
                          {project?.title || `Project #${bid.projectId}`}
                        </Link>
                        <span className="text-[11px] font-mono text-muted-foreground block">
                          Submitted {formatDate(bid.createdAt)}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 max-w-xs sm:max-w-md">
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {bid.proposal}
                        </p>
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono tabular-nums whitespace-nowrap font-medium text-ink">
                        <MoneyText amount={bid.amount} size="sm" />
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-muted-foreground whitespace-nowrap text-[11px]">
                        {bid.estimatedDays}d
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <StatusBadge status={bid.status} size="sm" />
                      </td>

                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => setEditingBid(bid)}
                                title="Edit proposal"
                              >
                                <Edit3 className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                                onClick={() => setWithdrawingBid(bid)}
                                title="Withdraw proposal"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}

                          {isAccepted && (
                            <Button asChild size="sm" variant="outline" className="h-7 px-2.5 text-xs">
                              <Link to="/contracts/1">
                                <span>Contract</span>
                                <ExternalLink className="w-3 h-3 ml-1 text-muted-foreground" />
                              </Link>
                            </Button>
                          )}

                          <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            <Link to={`/projects/${bid.projectId}`}>
                              <span>Brief</span>
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Proposal Dialog */}
      <EditBidDialog
        bid={editingBid}
        open={!!editingBid}
        onOpenChange={(open) => !open && setEditingBid(null)}
        projectId={editingBid?.projectId}
      />

      {/* Withdraw Proposal Confirmation Dialog */}
      <ConfirmDialog
        open={!!withdrawingBid}
        onOpenChange={(open) => !open && setWithdrawingBid(null)}
        title="Withdraw proposal"
        description={
          withdrawingBid
            ? `Withdraw your proposal of ₹${withdrawingBid.amount.toLocaleString(
                'en-IN'
              )}? The client will no longer be able to accept your proposal.`
            : ''
        }
        confirmLabel="Withdraw proposal"
        variant="destructive"
        isLoading={withdrawMutation.isPending}
        onConfirm={handleWithdrawConfirm}
      />
    </div>
  );
}
