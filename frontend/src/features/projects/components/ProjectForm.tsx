import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { projectSchema, ProjectFormValues } from '../schemas/projectSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MoneyText } from '@/components/shared/MoneyText';
import { formatINR } from '@/lib/format';

interface ProjectFormProps {
  initialValues?: Partial<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function ProjectForm({
  initialValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Publish Project',
}: ProjectFormProps) {
  const navigate = useNavigate();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    mode: 'onBlur',
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      budget: initialValues?.budget || 50000,
      deadline: initialValues?.deadline || minDate,
    },
  });

  const watchedBudget = watch('budget');
  const watchedDescription = watch('description') || '';

  const budgetPresets = [25000, 50000, 100000, 200000, 500000];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Title */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="title" className="text-xs font-medium text-ink">
            Project Title
          </Label>
          <span className="text-[11px] text-muted-foreground font-mono">Required</span>
        </div>
        <Input
          id="title"
          placeholder="e.g. Flutter mobile app for clinic booking"
          error={!!errors.title}
          className="h-9 text-xs"
          {...register('title')}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="description" className="text-xs font-medium text-ink">
            Technical Specification & Scope
          </Label>
          <span className="text-[11px] text-muted-foreground font-mono tabular-nums">
            {watchedDescription.length}/3000
          </span>
        </div>
        <Textarea
          id="description"
          rows={5}
          placeholder="Outline deliverables, technical stack requirements, milestone checkpoints, and acceptance criteria..."
          error={!!errors.description}
          className="text-xs leading-relaxed"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Budget Selection */}
      <div className="space-y-3 p-3.5 rounded-card bg-muted/20 border border-border">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <Label htmlFor="budget" className="text-xs font-medium text-ink">
              Project Budget (INR)
            </Label>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Total funds partitioned across approved milestone releases.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
              Formatted amount
            </span>
            <MoneyText amount={watchedBudget} size="lg" className="font-semibold text-ink" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <Input
            id="budget"
            type="number"
            step="1000"
            min="1000"
            placeholder="50000"
            error={!!errors.budget}
            className="h-9 text-xs font-mono tabular-nums"
            {...register('budget')}
          />

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            {budgetPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setValue('budget', preset, { shouldValidate: true })}
                className="text-xs px-2 py-1 rounded-badge bg-surface hover:bg-muted border border-border text-muted-foreground hover:text-ink font-mono tabular-nums transition-colors"
              >
                {formatINR(preset)}
              </button>
            ))}
          </div>
        </div>
        {errors.budget && (
          <p className="text-xs text-destructive">{errors.budget.message}</p>
        )}
      </div>

      {/* Target Deadline */}
      <div className="space-y-1.5">
        <Label htmlFor="deadline" className="text-xs font-medium text-ink">
          Target Completion Deadline
        </Label>
        <Input
          id="deadline"
          type="date"
          min={minDate}
          error={!!errors.deadline}
          className="h-9 text-xs font-mono"
          {...register('deadline')}
        />
        {errors.deadline && (
          <p className="text-xs text-destructive">{errors.deadline.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs"
          onClick={() => navigate(-1)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" isLoading={isLoading} className="h-8 px-4 text-xs">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

