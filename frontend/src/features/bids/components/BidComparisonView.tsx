import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjectBids, useAcceptBid, useRejectBid } from '../hooks/useBids';
import { useUser } from '@/features/auth/hooks/useUser';
import { BidResponse } from '@/types/api';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyText } from '@/components/shared/MoneyText';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/format';
import {
  LayoutList,
  LayoutGrid,
  Check,
  X,
  ExternalLink,
  Sparkles,
  ArrowUpDown,
  Clock,
} from 'lucide-react';

interface BidComparisonViewProps {
  projectId: number;
  projectBudget: number;
  projectStatus: string;
  isOwner: boolean;
  onPlaceBidClick?: () => void;
  canPlaceBid?: boolean;
}

function BidderCell({ freelancerId }: { freelancerId: number }) {
  const { user } = useUser(freelancerId);
  return (
    <div className="flex items-center gap-2">
      <UserAvatar name={user?.fullName} email={user?.email} size="xs" />
      <div>
        <span className="font-medium text-ink block text-xs truncate max-w-[140px]">
          {user?.fullName || `Engineer #${freelancerId}`}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground block truncate max-w-[140px]">
          {user?.email || 'Verified freelancer'}
        </span>
      </div>
    </div>
  );
}

export function BidComparisonView({
  projectId,
  projectBudget,
  projectStatus,
  isOwner,
  onPlaceBidClick,
  canPlaceBid,
}: BidComparisonViewProps) {
  const navigate = useNavigate();
  const { data: bids = [], isLoading, isError, refetch } = useProjectBids(projectId);

  const acceptMutation = useAcceptBid(projectId);
  const rejectMutation = useRejectBid(projectId);

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortBy, setSortBy] = useState<'best_value' | 'amount_low' | 'amount_high' | 'days_low' | 'newest'>('best_value');
  const [bidToAccept, setBidToAccept] = useState<BidResponse | null>(null);

  // Identify "Best Value" bid (lowest quote among active/pending bids that are within reasonable range)
  const bestValueBidId = useMemo(() => {
    const activeBids = bids.filter((b) => b.status === 'PENDING' || b.status === 'ACCEPTED');
    if (activeBids.length === 0) return null;
    const sorted = [...activeBids].sort((a, b) => a.amount - b.amount);
    return sorted[0].id;
  }, [bids]);

  // Sort bids based on selected filter
  const sortedBids = useMemo(() => {
    const result = [...bids];
    switch (sortBy) {
      case 'best_value':
        result.sort((a, b) => {
          if (a.id === bestValueBidId) return -1;
          if (b.id === bestValueBidId) return 1;
          return a.amount - b.amount;
        });
        break;
      case 'amount_low':
        result.sort((a, b) => a.amount - b.amount);
        break;
      case 'amount_high':
        result.sort((a, b) => b.amount - a.amount);
        break;
      case 'days_low':
        result.sort((a, b) => a.estimatedDays - b.estimatedDays);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
    }
    return result;
  }, [bids, sortBy, bestValueBidId]);

  const handleConfirmAccept = async () => {
    if (!bidToAccept) return;
    await acceptMutation.mutateAsync(bidToAccept.id);
    setBidToAccept(null);
    navigate('/contracts/1');
  };

  return (
    <div className="space-y-4">
      {/* Comparison Toolbar: Count, View Toggle (Table / Cards), Sort Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ink">Bids & Proposals</span>
          <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
            ({bids.length})
          </span>
          {projectBudget > 0 && (
            <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
              • Target: ₹{projectBudget.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-8 pl-2 pr-6 rounded-btn border border-border bg-surface text-ink text-xs font-medium focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="best_value">Sort: Best value</option>
              <option value="amount_low">Quote: Low to high</option>
              <option value="amount_high">Quote: High to low</option>
              <option value="days_low">Turnaround: Shortest</option>
              <option value="newest">Submitted: Newest</option>
            </select>
          </div>

          {/* Table / Cards View Toggle */}
          <div className="flex items-center rounded-btn border border-border p-0.5 bg-muted/40">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1 rounded text-xs transition-colors ${
                viewMode === 'table' ? 'bg-surface text-ink shadow-xs' : 'text-muted-foreground hover:text-ink'
              }`}
              title="Table view"
              aria-label="Table view"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1 rounded text-xs transition-colors ${
                viewMode === 'cards' ? 'bg-surface text-ink shadow-xs' : 'text-muted-foreground hover:text-ink'
              }`}
              title="Card comparison view"
              aria-label="Card comparison view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-12 rounded-card" />
          <Skeleton className="h-12 rounded-card" />
          <Skeleton className="h-12 rounded-card" />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-4 rounded-card border border-destructive/20 bg-rose-50/20 text-center space-y-2">
          <p className="text-xs text-destructive">Failed to load proposals for this project.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="h-7 text-xs">
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && sortedBids.length === 0 && (
        <EmptyState
          title="No bids yet"
          description="Freelancers will appear here as they respond."
          actionLabel={canPlaceBid ? 'Submit proposal' : undefined}
          onAction={onPlaceBidClick}
        />
      )}

      {/* Table View */}
      {!isLoading && !isError && sortedBids.length > 0 && viewMode === 'table' && (
        <div className="border border-border rounded-card overflow-hidden bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-mono uppercase text-[11px] tracking-wider select-none">
                <tr>
                  <th className="py-2.5 px-3 font-normal">Engineer</th>
                  <th className="py-2.5 px-3 font-normal">Technical Proposal</th>
                  <th className="py-2.5 px-3 font-normal text-right">Quote</th>
                  <th className="py-2.5 px-3 font-normal text-right">Days</th>
                  <th className="py-2.5 px-3 font-normal">Status</th>
                  {isOwner && projectStatus === 'OPEN' && (
                    <th className="py-2.5 px-3 font-normal text-right">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedBids.map((bid) => {
                  const isBestValue = bid.id === bestValueBidId && sortedBids.length > 1;

                  return (
                    <tr key={bid.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <BidderCell freelancerId={bid.freelancerId} />
                          {isBestValue && (
                            <span className="px-1.5 py-0.2 rounded-badge border border-border text-[10px] font-mono text-muted-foreground">
                              Best value
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 max-w-xs sm:max-w-sm">
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

                      {isOwner && projectStatus === 'OPEN' && (
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          {bid.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="accent"
                                className="h-7 px-2.5 text-xs font-medium"
                                onClick={() => setBidToAccept(bid)}
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Accept bid
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-1.5 text-xs text-muted-foreground hover:text-destructive"
                                title="Decline proposal"
                                onClick={() => rejectMutation.mutate(bid.id)}
                                disabled={rejectMutation.isPending}
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ) : bid.status === 'ACCEPTED' ? (
                            <Button asChild size="sm" variant="outline" className="h-7 px-2 text-xs">
                              <Link to="/contracts/1">
                                <span>Contract</span>
                                <ExternalLink className="w-3 h-3 ml-1 text-muted-foreground" />
                              </Link>
                            </Button>
                          ) : (
                            <span className="text-[11px] text-muted-foreground font-mono">Closed</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cards View */}
      {!isLoading && !isError && sortedBids.length > 0 && viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {sortedBids.map((bid) => {
            const isBestValue = bid.id === bestValueBidId && sortedBids.length > 1;

            return (
              <Card
                key={bid.id}
                className={`p-4 flex flex-col justify-between hover:border-foreground/30 transition-colors ${
                  isBestValue ? 'border-accent/40' : ''
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <BidderCell freelancerId={bid.freelancerId} />
                    <div className="flex items-center gap-1.5">
                      {isBestValue && (
                        <span className="px-1.5 py-0.5 rounded-badge border border-accent/40 text-[10px] font-mono text-accent">
                          Best value
                        </span>
                      )}
                      <StatusBadge status={bid.status} size="sm" />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {bid.proposal}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                      Quote ({bid.estimatedDays} days)
                    </span>
                    <MoneyText amount={bid.amount} size="md" className="font-semibold text-ink" />
                  </div>

                  {isOwner && projectStatus === 'OPEN' && bid.status === 'PENDING' && (
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="accent"
                        className="h-8 px-3 text-xs font-medium"
                        onClick={() => setBidToAccept(bid)}
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Accept bid
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => rejectMutation.mutate(bid.id)}
                        disabled={rejectMutation.isPending}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}

                  {bid.status === 'ACCEPTED' && (
                    <Button asChild size="sm" variant="outline" className="h-8 px-2.5 text-xs">
                      <Link to="/contracts/1">
                        <span>Contract workspace</span>
                        <ExternalLink className="w-3 h-3 ml-1 text-muted-foreground" />
                      </Link>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog Explaining Contract Creation Consequences */}
      <ConfirmDialog
        open={!!bidToAccept}
        onOpenChange={(open) => !open && setBidToAccept(null)}
        title="Accept proposal & create contract"
        description={
          bidToAccept
            ? `Accepting this proposal creates a contract of ₹${bidToAccept.amount.toLocaleString(
                'en-IN'
              )} and moves the project to In Progress. Other bids stay pending.`
            : ''
        }
        confirmLabel="Accept bid"
        variant="default"
        isLoading={acceptMutation.isPending}
        onConfirm={handleConfirmAccept}
      />
    </div>
  );
}
