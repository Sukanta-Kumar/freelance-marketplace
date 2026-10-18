import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProject, useDeleteProject } from '../hooks/useProjects';
import { useUser } from '@/features/auth/hooks/useUser';
import { useAuthStore } from '@/stores/authStore';
import { BidComparisonView } from '@/features/bids/components/BidComparisonView';
import { PlaceBidDialog } from '@/features/bids/components/PlaceBidDialog';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyText } from '@/components/shared/MoneyText';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/format';
import {
  Shield,
  Edit3,
  Trash2,
  Send,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = Number(id);

  const { user: currentUser, role } = useAuthStore();
  const { data: project, isLoading, isError } = useProject(projectId);
  const { user: clientUser } = useUser(project?.clientId);
  const deleteMutation = useDeleteProject();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [placeBidOpen, setPlaceBidOpen] = useState(false);

  const isOwner = Boolean(
    currentUser && project && currentUser.id === project.clientId
  );

  const isFreelancer = role === 'FREELANCER';

  const handleDelete = async () => {
    if (!project) return;
    await deleteMutation.mutateAsync(project.id);
    navigate('/projects');
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl">
        <Skeleton className="h-4 w-40 rounded" />
        <Skeleton className="h-8 w-80 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <Skeleton className="h-96 rounded-card lg:col-span-8" />
          <Skeleton className="h-64 rounded-card lg:col-span-4" />
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="p-8 text-center space-y-3 max-w-md mx-auto my-12 rounded-card border border-border bg-surface">
        <AlertCircle className="w-6 h-6 text-destructive mx-auto" />
        <h2 className="text-sm font-semibold">Project not found</h2>
        <p className="text-xs text-muted-foreground">
          The project brief you requested does not exist or has been removed.
        </p>
        <Button asChild size="sm" variant="outline" className="h-8 text-xs">
          <Link to="/browse">Return to open projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Mono Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
        <Link to="/browse" className="hover:text-ink transition-colors">
          Projects
        </Link>
        <span>/</span>
        <span className="text-ink font-medium truncate max-w-xs">{project.title}</span>
      </nav>

      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-3 border-b border-border">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-ink">
              {project.title}
            </h1>
            <StatusBadge status={project.status} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Project #{project.id} • Posted {formatDate(project.createdAt)}
          </p>
        </div>

        {/* Header Actions for Owner */}
        {isOwner && (
          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" size="sm" className="h-8 px-2.5 text-xs">
              <Link to={`/projects/${project.id}/edit`}>
                <Edit3 className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                Edit brief
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 px-2.5 text-xs"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* 2-Column Asymmetric Layout: Main Brief & Bids Comparison (Left) + Narrow Sticky Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Scope & Bids (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Technical Scope Card */}
          <div className="border border-border rounded-card bg-surface p-5 space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Technical Specification & Scope
            </div>
            <div className="text-xs text-ink leading-relaxed whitespace-pre-line">
              {project.description}
            </div>
          </div>

          {/* Proposals & Bids Comparison Section */}
          <BidComparisonView
            projectId={project.id}
            projectBudget={project.budget}
            projectStatus={project.status}
            isOwner={isOwner}
            canPlaceBid={isFreelancer && project.status === 'OPEN'}
            onPlaceBidClick={() => setPlaceBidOpen(true)}
          />
        </div>

        {/* Right Column: Narrow Sticky Summary Sidebar (lg:col-span-4) */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <Card className="p-4 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                Escrow Budget
              </span>
              <MoneyText
                amount={project.budget}
                size="xl"
                className="font-bold text-ink mt-0.5"
              />
            </div>

            <div className="border-t border-border pt-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Target deadline</span>
                <span className="font-mono text-ink font-medium">
                  {formatDate(project.deadline)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Project status</span>
                <StatusBadge status={project.status} size="sm" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sponsor</span>
                <div className="flex items-center gap-1.5 font-medium text-ink">
                  <UserAvatar name={clientUser?.fullName} email={clientUser?.email} size="xs" />
                  <span className="truncate max-w-[120px]">
                    {clientUser?.fullName || `Client #${project.clientId}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Single Main CTA */}
            <div className="border-t border-border pt-3">
              {isFreelancer && project.status === 'OPEN' && (
                <Button
                  variant="accent"
                  className="w-full h-9 text-xs font-medium"
                  onClick={() => setPlaceBidOpen(true)}
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Submit proposal
                </Button>
              )}

              {isOwner && project.status === 'OPEN' && (
                <div className="text-[11px] text-muted-foreground text-center">
                  Review proposals from engineers to generate an escrow contract.
                </div>
              )}

              {project.status === 'IN_PROGRESS' && (
                <Button asChild className="w-full h-9 text-xs font-medium">
                  <Link to="/contracts/1">
                    <span>Open contract workspace</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </Button>
              )}
            </div>
          </Card>

          {/* Quiet Trust / Escrow Note */}
          <div className="p-3 rounded-card border border-border bg-subtle text-[11px] text-muted-foreground space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-ink">
              <Shield className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Milestone escrow protection</span>
            </div>
            <p className="leading-relaxed">
              Funds are reserved upon bid acceptance and released sequentially only when deliverables are verified.
            </p>
          </div>
        </div>
      </div>

      {/* Place Bid Modal for Freelancer */}
      <PlaceBidDialog
        open={placeBidOpen}
        onOpenChange={setPlaceBidOpen}
        projectId={project.id}
        projectTitle={project.title}
        projectBudget={project.budget}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete project brief"
        description={`Are you sure you want to delete "${project.title}"? This cannot be undone.`}
        confirmLabel="Delete project"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
