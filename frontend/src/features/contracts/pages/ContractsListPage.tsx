import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMyContracts } from '../hooks/useContracts';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { useAuthStore } from '@/stores/authStore';
import { useUser } from '@/features/auth/hooks/useUser';
import { ContractResponse, ProjectResponse } from '@/types/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyText } from '@/components/shared/MoneyText';
import { EmptyState } from '@/components/shared/EmptyState';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/format';
import {
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

const statusTabs = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

function ContractCounterpartCell({
  contract,
  currentRole,
  currentUserId,
}: {
  contract: ContractResponse;
  currentRole?: string | null;
  currentUserId?: string | number | null;
}) {
  const isClient =
    currentRole === 'CLIENT' || String(currentUserId) === String(contract.clientId);
  const targetUserId = isClient ? contract.freelancerId : contract.clientId;
  const { user } = useUser(targetUserId);

  return (
    <div className="flex items-center gap-2">
      <UserAvatar name={user?.fullName} size="xs" />
      <div className="min-w-0">
        <span className="font-medium text-ink block truncate max-w-[130px]">
          {user?.fullName || (isClient ? 'Engineer' : 'Client')}
        </span>
        <span className="text-[10px] text-muted-foreground block font-mono">
          {isClient ? 'Engineer' : 'Client sponsor'}
        </span>
      </div>
    </div>
  );
}

export default function ContractsListPage() {
  const { data: contracts = [], isLoading: contractsLoading, isError: contractsError, refetch } = useMyContracts();
  const { data: projects = [] } = useProjects();
  const { role, userId } = useAuthStore();

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Map projectId to Project
  const projectMap = useMemo(() => {
    const map = new Map<number, ProjectResponse>();
    projects.forEach((p) => map.set(p.id, p));
    return map;
  }, [projects]);

  // Filter contracts by tab and search
  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      const matchesTab = activeTab === 'ALL' || c.status === activeTab;
      const project = projectMap.get(c.projectId);
      const matchesSearch =
        `contract #${c.id}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project?.title || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [contracts, activeTab, searchQuery, projectMap]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contracts & Escrow"
        description="Active agreements, sequential deliverable milestones, and secured escrow transactions."
        badge={
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Escrow Protected</span>
          </div>
        }
      />

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {statusTabs.map((tab) => {
            const count =
              tab.value === 'ALL'
                ? contracts.length
                : contracts.filter((c) => c.status === tab.value).length;

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

        {/* Search Input */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Loading Skeletons */}
      {contractsLoading && (
        <div className="space-y-2">
          <Skeleton className="h-12 rounded-card" />
          <Skeleton className="h-12 rounded-card" />
          <Skeleton className="h-12 rounded-card" />
        </div>
      )}

      {/* Error State */}
      {contractsError && (
        <div className="p-4 rounded-card border border-destructive/20 bg-rose-50/20 text-center space-y-2">
          <div className="flex items-center justify-center text-destructive text-xs font-medium gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Failed to load contract records</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="h-7 text-xs">
            <RefreshCw className="w-3 h-3 mr-1.5" />
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!contractsLoading && !contractsError && filteredContracts.length === 0 && (
        <EmptyState
          title={searchQuery ? 'No matching contracts found' : 'No contracts found'}
          description={
            searchQuery
              ? `No contracts matched "${searchQuery}".`
              : role === 'CLIENT'
              ? 'Accept a proposal on one of your posted projects to initiate a milestone contract.'
              : 'Submit proposals on open projects to start your first milestone engagement.'
          }
          actionLabel={
            searchQuery
              ? 'Clear filter'
              : role === 'CLIENT'
              ? 'My projects'
              : 'Browse projects'
          }
          onAction={
            searchQuery
              ? () => setSearchQuery('')
              : undefined
          }
        />
      )}

      {/* Hairline Data Table */}
      {!contractsLoading && !contractsError && filteredContracts.length > 0 && (
        <div className="border border-border rounded-card overflow-hidden bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-mono uppercase text-[11px] tracking-wider select-none">
                <tr>
                  <th className="py-2.5 px-4 font-normal">Contract ID</th>
                  <th className="py-2.5 px-3 font-normal">Project Brief</th>
                  <th className="py-2.5 px-3 font-normal">Counterpart</th>
                  <th className="py-2.5 px-3 font-normal text-right">Escrow Amount</th>
                  <th className="py-2.5 px-3 font-normal">Status</th>
                  <th className="py-2.5 px-3 font-normal">Started</th>
                  <th className="py-2.5 px-3 font-normal text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredContracts.map((contract) => {
                  const project = projectMap.get(contract.projectId);

                  return (
                    <tr key={contract.id} className="hover:bg-muted/20 transition-colors h-12">
                      <td className="py-2.5 px-4 font-mono font-medium text-ink whitespace-nowrap">
                        <Link
                          to={`/contracts/${contract.id}`}
                          className="hover:text-accent transition-colors"
                        >
                          #{contract.id}
                        </Link>
                      </td>

                      <td className="py-2.5 px-3 max-w-xs sm:max-w-sm">
                        <Link
                          to={`/contracts/${contract.id}`}
                          className="font-medium text-ink hover:text-accent transition-colors block truncate"
                        >
                          {project?.title || `Project #${contract.projectId}`}
                        </Link>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <ContractCounterpartCell
                          contract={contract}
                          currentRole={role}
                          currentUserId={userId}
                        />
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono tabular-nums whitespace-nowrap font-medium text-ink">
                        <MoneyText amount={contract.totalAmount} size="sm" />
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <StatusBadge status={contract.status} size="sm" />
                      </td>

                      <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {contract.startDate ? formatDate(contract.startDate) : formatDate(contract.createdAt)}
                      </td>

                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <Button asChild size="sm" variant="outline" className="h-7 px-2.5 text-xs font-medium">
                          <Link to={`/contracts/${contract.id}`}>
                            <span>Workspace</span>
                            <ExternalLink className="w-3 h-3 ml-1 text-muted-foreground" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
