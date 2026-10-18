import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitDeliverableSchema, SubmitDeliverableFormValues } from '../schemas/milestoneSchemas';
import { useSubmitMilestone } from '../hooks/useMilestones';
import { MilestoneResponse } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface SubmitWorkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: number;
  milestone: MilestoneResponse | null;
}

export function SubmitWorkDialog({
  open,
  onOpenChange,
  contractId,
  milestone,
}: SubmitWorkDialogProps) {
  const submitMutation = useSubmitMilestone(contractId);
  const isResubmission = milestone?.status === 'REJECTED';

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SubmitDeliverableFormValues>({
    resolver: zodResolver(submitDeliverableSchema),
    mode: 'onBlur',
    defaultValues: {
      deliverableUrl: milestone?.deliverableUrl || '',
      description: milestone?.submissionDescription || '',
    },
  });

  useEffect(() => {
    if (milestone) {
      reset({
        deliverableUrl: milestone.deliverableUrl || '',
        description: milestone.submissionDescription || '',
      });
    }
  }, [milestone, reset]);

  const watchedNotes = watch('description') || '';

  const onSubmit = async (values: SubmitDeliverableFormValues) => {
    if (!milestone) return;

    await submitMutation.mutateAsync({
      id: milestone.id,
      payload: {
        deliverableUrl: values.deliverableUrl,
        description: values.description,
      },
    });

    onOpenChange(false);
  };

  if (!milestone) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isResubmission ? 'Resubmit revised deliverable' : 'Submit deliverable for review'}
          </DialogTitle>
          <DialogDescription className="line-clamp-1">
            Milestone #{milestone.sequenceNumber}: {milestone.title}
          </DialogDescription>
        </DialogHeader>

        {/* Feedback reminder if resubmitting */}
        {isResubmission && milestone.rejectionReason && (
          <div className="rounded-card border border-destructive/20 bg-rose-50/20 p-3 space-y-1 text-xs text-destructive">
            <span className="font-semibold flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              Client Feedback to Address:
            </span>
            <p className="text-[11px] leading-relaxed text-ink/80">{milestone.rejectionReason}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1" noValidate>
          {/* Deliverable URL */}
          <div className="space-y-1">
            <Label htmlFor="deliverableUrl" className="text-xs font-medium text-ink">
              Deliverable URL / Pull Request / Preview
            </Label>
            <Input
              id="deliverableUrl"
              type="url"
              placeholder="https://github.com/org/repo/pull/42 or https://preview.app"
              error={!!errors.deliverableUrl}
              className="h-9 text-xs font-mono"
              {...register('deliverableUrl')}
            />
            {errors.deliverableUrl && (
              <p className="text-[11px] text-destructive">{errors.deliverableUrl.message}</p>
            )}
          </div>

          {/* Release Notes */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="submitNotes" className="text-xs font-medium text-ink">
                Release Notes & Verification Instructions
              </Label>
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                {watchedNotes.length}/2000
              </span>
            </div>
            <Textarea
              id="submitNotes"
              rows={4}
              placeholder="Outline what has been completed, test commands executed, and verification steps for the client..."
              error={!!errors.description}
              className="text-xs leading-relaxed"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-[11px] text-destructive">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              size="sm"
              className="h-8 text-xs font-medium"
              isLoading={submitMutation.isPending}
            >
              <ArrowRight className="w-3.5 h-3.5 mr-1" />
              {isResubmission ? 'Submit revision' : 'Submit for review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
