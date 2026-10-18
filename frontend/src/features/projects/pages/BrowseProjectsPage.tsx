import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useUser } from '@/features/auth/hooks/useUser';
import { ProjectResponse } from '@/types/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyText } from '@/components/shared/MoneyText';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/format';
import { Search, ArrowRight, Filter } from 'lucide-react';

function ProjectClientBadge({ clientId }: { clientId: number }) {
  const { user } = useUser(clientId);
  return (
    <div className="flex items-center gap-2">
      <UserAvatar name={user?.fullName} email={user?.email} size="xs" />
      <span className="text-xs text-muted-foreground font-medium truncate max-w-[140px]">
        {user?.fullName || `Client #${clientId}`}
      </span>
    </div>
  );
}

export default function BrowseProjectsPage() {
  const { data: rawProjects = [], isLoading } = useProjects();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [minBudget, setMinBudget] = useState<number | ''>('');
  const [maxBudget, setMaxBudget] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<'latest' | 'budget_high' | 'budget_low'>('latest');

  // 300ms Debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort
  const filteredProjects = useMemo(() => {
    let result = rawProjects.filter((p: ProjectResponse) => {
      const matchesSearch =
        p.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(debouncedQuery.toLowerCase());

      const matchesMin = minBudget === '' || p.budget >= Number(minBudget);
      const matchesMax = maxBudget === '' || p.budget <= Number(maxBudget);

      return matchesSearch && matchesMin && matchesMax;
    });

    result.sort((a, b) => {
      if (sortBy === 'budget_high') return b.budget - a.budget;
      if (sortBy === 'budget_low') return a.budget - b.budget;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return result;
  }, [rawProjects, debouncedQuery, minBudget, maxBudget, sortBy]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Open Projects"
        description="Active project briefs open for bids. All contracts are escrow-funded milestone by milestone."
        badge={
          <span className="inline-flex items-center px-2 py-0.5 rounded-badge border border-border text-[11px] font-mono text-muted-foreground">
            Escrow protected
          </span>
        }
      />

      {/* Search & Filter Toolbar */}
      <div className="p-3 rounded-card bg-surface border border-border space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter by title, stack, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Min Budget */}
          <div className="w-full sm:w-36">
            <Input
              type="number"
              placeholder="Min budget"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value ? Number(e.target.value) : '')}
              className="h-9 text-xs font-mono"
            />
          </div>

          {/* Max Budget */}
          <div className="w-full sm:w-36">
            <Input
              type="number"
              placeholder="Max budget"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value ? Number(e.target.value) : '')}
              className="h-9 text-xs font-mono"
            />
          </div>

          {/* Sort Selector */}
          <div className="w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-9 px-2.5 rounded-btn border border-border bg-surface text-ink text-xs font-medium focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="latest">Sort: Newest</option>
              <option value="budget_high">Budget: High to low</option>
              <option value="budget_low">Budget: Low to high</option>
            </select>
          </div>
        </div>

        {/* Quick Budget Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border text-xs">
          <span className="text-muted-foreground font-mono text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Presets:
          </span>
          <button
            type="button"
            onClick={() => {
              setMinBudget('');
              setMaxBudget('');
            }}
            className={`px-2 py-0.5 rounded-badge border text-xs font-medium transition-colors ${
              minBudget === '' && maxBudget === ''
                ? 'bg-ink text-surface border-ink'
                : 'bg-surface text-muted-foreground hover:text-ink border-border'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => {
              setMinBudget(50000);
              setMaxBudget('');
            }}
            className={`px-2 py-0.5 rounded-badge border text-xs font-mono transition-colors ${
              minBudget === 50000
                ? 'bg-ink text-surface border-ink'
                : 'bg-surface text-muted-foreground hover:text-ink border-border'
            }`}
          >
            ≥ ₹50,000
          </button>
          <button
            type="button"
            onClick={() => {
              setMinBudget(100000);
              setMaxBudget('');
            }}
            className={`px-2 py-0.5 rounded-badge border text-xs font-mono transition-colors ${
              minBudget === 100000
                ? 'bg-ink text-surface border-ink'
                : 'bg-surface text-muted-foreground hover:text-ink border-border'
            }`}
          >
            ≥ ₹1,00,000
          </button>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Skeleton className="h-44 rounded-card" />
          <Skeleton className="h-44 rounded-card" />
          <Skeleton className="h-44 rounded-card" />
          <Skeleton className="h-44 rounded-card" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProjects.length === 0 && (
        <EmptyState
          title="No projects match this filter"
          description="Try broadening your search keywords or resetting budget bounds."
          actionLabel="Reset filters"
          onAction={() => {
            setSearchQuery('');
            setMinBudget('');
            setMaxBudget('');
          }}
        />
      )}

      {/* Standalone Project Cards */}
      {!isLoading && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="p-4 flex flex-col justify-between hover:border-foreground/30 transition-colors"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <ProjectClientBadge clientId={project.clientId} />
                  <StatusBadge status={project.status} size="sm" />
                </div>

                <Link
                  to={`/projects/${project.id}`}
                  className="font-semibold text-[15px] text-ink hover:text-accent transition-colors block line-clamp-1"
                >
                  {project.title}
                </Link>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                    Budget
                  </span>
                  <MoneyText amount={project.budget} size="md" className="font-semibold text-ink" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                      Target deadline
                    </span>
                    <span className="text-xs font-mono text-ink">
                      {formatDate(project.deadline)}
                    </span>
                  </div>

                  <Button asChild size="sm" variant="outline" className="h-8 px-3 text-xs">
                    <Link to={`/projects/${project.id}`}>
                      <span>View brief</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

