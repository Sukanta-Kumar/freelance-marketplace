import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProject, useUpdateProject } from '../hooks/useProjects';
import { ProjectForm } from '../components/ProjectForm';
import { ProjectFormValues } from '../schemas/projectSchemas';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = Number(id);

  const { data: project, isLoading, isError } = useProject(projectId);
  const updateMutation = useUpdateProject(projectId);

  const handleSubmit = async (values: ProjectFormValues) => {
    await updateMutation.mutateAsync({
      title: values.title,
      description: values.description,
      budget: values.budget,
      deadline: values.deadline,
    });
    navigate(`/projects/${projectId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-8 w-60 rounded" />
        <Skeleton className="h-80 rounded-card" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="p-6 text-center space-y-3 max-w-md mx-auto my-12 rounded-card border border-border bg-surface">
        <AlertCircle className="w-6 h-6 text-destructive mx-auto" />
        <h2 className="text-sm font-semibold">Project not found</h2>
        <p className="text-xs text-muted-foreground">
          The requested project record could not be loaded.
        </p>
        <Button asChild size="sm" variant="outline" className="h-8 text-xs">
          <Link to="/projects">Return to projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
        <Link to="/projects" className="hover:text-ink transition-colors">
          Projects
        </Link>
        <span>/</span>
        <Link to={`/projects/${projectId}`} className="hover:text-ink transition-colors truncate max-w-[200px]">
          {project.title}
        </Link>
        <span>/</span>
        <span className="text-ink font-medium">Edit</span>
      </nav>

      <PageHeader
        title="Edit project brief"
        description="Update technical requirements, budget, or target delivery date."
      />

      <Card className="p-5">
        <ProjectForm
          initialValues={{
            title: project.title,
            description: project.description,
            budget: project.budget,
            deadline: project.deadline ? project.deadline.split('T')[0] : '',
          }}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
          submitLabel="Save changes"
        />
      </Card>
    </div>
  );
}

