import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMilestoneSchema, CreateMilestoneFormValues } from '../schemas/milestoneSchemas';
import { useCreateMilestone } from '../hooks/useMilestones';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MoneyText } from '@/components/shared/MoneyText';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { AlertCircle, Plus } from 'lucide-react';

interface AddMilestoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: number;
  totalContractBudget: number;
  allocatedAmount: number;
  nextSequenceNumber: number;
}

export function AddMilestoneDialog({
  open,
  onOpenChange,
  contractId,
  totalContractBudget,
  allocatedAmount,
  nextSequenceNumber,
}: AddMilestoneDialogProps) {
  const createMutation = useCreateMilestone(contractId);
  const remainingBudget = Math.max(0, totalContractBudget - allocatedAmount);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateMilestoneFormValues>({
    resolver: zodResolver(createMilestoneSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      amount: remainingBudget > 0 ? remainingBudget : 5000,
      dueDate: '',
    },
  });

  const watchedAmount = watch('amount');
  const watchedDesc = watch('description') || '';
  const exceedsRemaining = typeof watchedAmount === 'number' && watchedAmount > remainingBudget;

  const onSubmit = async (values: CreateMilestoneFormValues) => {
    if (values.amount > remainingBudget) {
      setError('amount', {
        type: 'manual',
        message: `Amount exceeds unallocated budget of ₹${remainingBudget.toLocaleString('en-IN')}`,
      });
      return;
    }

    await createMutation.mutateAsync({
      title: values.title,
      description: values.description,
      amount: values.amount,
      sequenceNumber: nextSequenceNumber,
      dueDate: values.dueDate || undefined,
    });

    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add contract milestone</DialogTitle>
          <DialogDescription>
            Define deliverable criteria and lock escrow allocation for Milestone #{nextSequenceNumber}.
          </DialogDescription>
        </DialogHeader>

        {/* Quiet Utility Budget Ledger Strip */}
        <div className="rounded-card border border-border bg-muted/20 p-3 space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Contract Total:</span>
            <span className="text-ink font-semibold">₹{totalContractBudget.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Allocated:</span>
            <span className="text-ink">₹{allocatedAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="border-t border-border pt-1.5 flex items-center justify-between font-semibold text-ink">
            <span>Remaining unallocated:</span>
            <span className={remainingBudget <= 0 ? 'text-destructive' : 'text-accent'}>
              ₹{remainingBudget.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1" noValidate>
          {/* Milestone Title */}
          <div className="space-y-1">
            <Label htmlFor="milestoneTitle" className="text-xs font-medium text-ink">
              Milestone Title
            </Label>
            <Input
              id="milestoneTitle"
              type="text"
              placeholder="e.g. Database schema migration & GraphQL resolvers"
              error={!!errors.title}
              className="h-9 text-xs"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-[11px] text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Amount & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="milestoneAmount" className="text-xs font-medium text-ink">
                  Payout (INR)
                </Label>
                {typeof watchedAmount === 'number' && watchedAmount > 0 && (
                  <MoneyText amount={watchedAmount} size="xs" className="font-mono text-[11px] text-muted-foreground" />
                )}
              </div>
              <Input
                id="milestoneAmount"
                type="number"
                step="500"
                min="500"
                placeholder="25000"
                error={!!errors.amount || exceedsRemaining}
                className="h-9 text-xs font-mono"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-[11px] text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="milestoneDueDate" className="text-xs font-medium text-ink">
                Target Due Date (optional)
              </Label>
              <Input
                id="milestoneDueDate"
                type="date"
                className="h-9 text-xs font-mono"
                {...register('dueDate')}
              />
            </div>
          </div>

          {/* Budget Limit Exceeded Notice */}
          {exceedsRemaining && (
            <div className="p-2.5 rounded-card border border-destructive/20 bg-destructive/5 text-destructive text-xs flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <p className="text-[11px] leading-relaxed">
                Payout exceeds unallocated contract balance by ₹
                {(watchedAmount - remainingBudget).toLocaleString('en-IN')}. Reduce amount or increase contract budget.
              </p>
            </div>
          )}

          {/* Description / Deliverable Specification */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="milestoneDesc" className="text-xs font-medium text-ink">
                Deliverable Specification & Acceptance Criteria
              </Label>
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                {watchedDesc.length}/2000
              </span>
            </div>
            <Textarea
              id="milestoneDesc"
              rows={4}
              placeholder="State explicit completion requirements, test fixtures to pass, and expected repo deliverables..."
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
              isLoading={createMutation.isPending}
              disabled={exceedsRemaining || remainingBudget <= 0}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Create milestone
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
