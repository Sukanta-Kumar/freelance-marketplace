import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rejectDeliverableSchema, RejectDeliverableFormValues } from '../schemas/milestoneSchemas';
import { useRejectMilestone } from '../hooks/useMilestones';
import { MilestoneResponse } from '@/types/api';
import { Button } from '@/components/ui/button';
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
import { RotateCcw } from 'lucide-react';

interface RejectWorkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: number;
  milestone: MilestoneResponse | null;
}

export function RejectWorkDialog({
  open,
  onOpenChange,
  contractId,
  milestone,
}: RejectWorkDialogProps) {
  const rejectMutation = useRejectMilestone(contractId);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RejectDeliverableFormValues>({
    resolver: zodResolver(rejectDeliverableSchema),
    mode: 'onBlur',
    defaultValues: {
      reason: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({ reason: '' });
    }
  }, [open, reset]);

  const watchedReason = watch('reason') || '';

  const onSubmit = async (values: RejectDeliverableFormValues) => {
    if (!milestone) return;

    await rejectMutation.mutateAsync({
      id: milestone.id,
      payload: {
        reason: values.reason,
      },
    });

    onOpenChange(false);
  };

  if (!milestone) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request deliverable revision</DialogTitle>
          <DialogDescription className="line-clamp-1">
            Specify required adjustments for Milestone #{milestone.sequenceNumber}: {milestone.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1" noValidate>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="rejectReason" className="text-xs font-medium text-ink">
                Feedback & Required Adjustments
              </Label>
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                {watchedReason.length}/1000
              </span>
            </div>
            <Textarea
              id="rejectReason"
              rows={4}
              placeholder="e.g. Please fix the broken responsive layout on iPad screen widths and ensure all test assertions in paymentService.spec.ts pass..."
              error={!!errors.reason}
              className="text-xs leading-relaxed"
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-[11px] text-destructive">{errors.reason.message}</p>
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
              variant="default"
              size="sm"
              className="h-8 text-xs font-medium"
              isLoading={rejectMutation.isPending}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
              Request revision
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
