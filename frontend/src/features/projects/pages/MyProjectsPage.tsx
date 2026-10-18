import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMyProjects, useDeleteProject } from '../hooks/useProjects';
import { ProjectResponse } from '@/types/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyText } from '@/components/shared/MoneyText';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/format';
import {
  Plus,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusTabs = [
  { label: 'All', value: 'ALL' },
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function MyProjectsPage() {
  const navigate = useNavigate();
  const { data: projects = [], isLoading, isError, refetch } = useMyProjects();
  const deleteMutation = useDeleteProject();

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<ProjectResponse | null>(null);

  // Filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesTab = activeTab === 'ALL' || project.status === activeTab;
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [projects, activeTab, searchQuery]);

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    await deleteMutation.mutateAsync(projectToDelete.id);
    setProjectToDelete(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Projects"
        description="Contracts, open project listings, and specifications posted under your account."
        actions={
          <Button asChild variant="accent" size="sm" className="h-8 px-3 text-xs">
            <Link to="/projects/new">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Post project
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
                ? projects.length
                : projects.filter((p) => p.status === tab.value).length;

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
            placeholder="Filter projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
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
          <div className="flex items-center justify-center text-destructive text-xs font-medium gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Failed to load project records</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="h-7 text-xs">
            <RefreshCw className="w-3 h-3 mr-1.5" />
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredProjects.length === 0 && (
        <EmptyState
          title={searchQuery ? 'No matching projects found' : 'No projects posted yet'}
          description={
            searchQuery
              ? `No projects matched "${searchQuery}".`
              : 'Post a project specification to receive bids from engineers.'
          }
          actionLabel={searchQuery ? 'Clear filter' : 'Post a project'}
          onAction={
            searchQuery ? () => setSearchQuery('') : () => navigate('/projects/new')
          }
        />
      )}

      {/* Hairline Table for Projects */}
      {!isLoading && !isError && filteredProjects.length > 0 && (
        <div className="border border-border rounded-card overflow-hidden bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-mono uppercase text-[11px] tracking-wider select-none">
                <tr>
                  <th className="py-2.5 px-4 font-normal">Project</th>
                  <th className="py-2.5 px-3 font-normal">Status</th>
                  <th className="py-2.5 px-3 font-normal text-right">Budget</th>
                  <th className="py-2.5 px-3 font-normal">Deadline</th>
                  <th className="py-2.5 px-3 font-normal hidden md:table-cell">Posted</th>
                  <th className="py-2.5 px-3 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-muted/20 transition-colors h-11"
                  >
                    <td className="py-2.5 px-4 max-w-xs sm:max-w-md">
                      <Link
                        to={`/projects/${project.id}`}
                        className="font-medium text-ink hover:text-accent transition-colors block truncate"
                      >
                        {project.title}
                      </Link>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {project.description}
                      </p>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <StatusBadge status={project.status} size="sm" />
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono tabular-nums whitespace-nowrap font-medium text-ink">
                      <MoneyText amount={project.budget} size="sm" />
                    </td>

                    <td className="py-2.5 px-3 font-mono text-muted-foreground whitespace-nowrap text-[11px]">
                      {formatDate(project.deadline)}
                    </td>

                    <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap text-[11px] hidden md:table-cell">
                      {formatDate(project.createdAt)}
                    </td>

                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <Link to={`/projects/${project.id}`}>
                            <span>View</span>
                            <ExternalLink className="w-3 h-3 ml-1 text-muted-foreground" />
                          </Link>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm" className="h-7 w-7" aria-label="Project actions">
                              <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => navigate(`/projects/${project.id}/edit`)}>
                              <Edit3 className="w-3.5 h-3.5 mr-2" />
                              Edit brief
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setProjectToDelete(project)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
        title="Delete project brief"
        description={`Are you sure you want to delete "${projectToDelete?.title}"? Active bids will be cancelled. This action cannot be undone.`}
        confirmLabel="Delete project"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

