import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateProject } from '../hooks/useProjects';
import { ProjectForm } from '../components/ProjectForm';
import { ProjectFormValues } from '../schemas/projectSchemas';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const createMutation = useCreateProject();

  const handleSubmit = async (values: ProjectFormValues) => {
    const created = await createMutation.mutateAsync({
      title: values.title,
      description: values.description,
      budget: values.budget,
      deadline: values.deadline,
    });
    navigate(`/projects/${created.id}`);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
        <Link to="/projects" className="hover:text-ink transition-colors">
          Projects
        </Link>
        <span>/</span>
        <span className="text-ink font-medium">New</span>
      </nav>

      <PageHeader
        title="New project"
        description="Set scope, delivery target, and maximum escrow allocation."
      />

      <Card className="p-5">
        <ProjectForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
          submitLabel="Publish project"
        />
      </Card>
    </div>
  );
}

