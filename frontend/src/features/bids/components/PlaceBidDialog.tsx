import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bidSchema, BidFormValues } from '../schemas/bidSchemas';
import { useCreateBid } from '../hooks/useBids';
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
import { AlertCircle, Send } from 'lucide-react';

interface PlaceBidDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  projectTitle: string;
  projectBudget: number;
}

export function PlaceBidDialog({
  open,
  onOpenChange,
  projectId,
  projectTitle,
  projectBudget,
}: PlaceBidDialogProps) {
  const createMutation = useCreateBid(projectId);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    mode: 'onBlur',
    defaultValues: {
      amount: projectBudget,
      estimatedDays: 14,
      proposal: '',
    },
  });

  const watchedAmount = watch('amount');
  const watchedProposal = watch('proposal') || '';

  // Soft warning if quote deviates significantly from project budget
  const isOverBudget = typeof watchedAmount === 'number' && watchedAmount > projectBudget;
  const isSignificantlyBelow =
    typeof watchedAmount === 'number' && watchedAmount > 0 && watchedAmount < projectBudget * 0.5;

  const onSubmit = async (values: BidFormValues) => {
    await createMutation.mutateAsync({
      amount: values.amount,
      estimatedDays: values.estimatedDays,
      proposal: values.proposal,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit proposal</DialogTitle>
          <DialogDescription className="line-clamp-1">
            Quote and turnaround for "{projectTitle}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1" noValidate>
          {/* Quote Amount & Estimated Days */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="bidAmount" className="text-xs font-medium text-ink">
                  Quote (INR)
                </Label>
                {typeof watchedAmount === 'number' && watchedAmount > 0 && (
                  <MoneyText amount={watchedAmount} size="xs" className="font-mono text-[11px] text-muted-foreground" />
                )}
              </div>
              <Input
                id="bidAmount"
                type="number"
                step="500"
                min="500"
                placeholder="e.g. 50000"
                error={!!errors.amount}
                className="h-9 text-xs font-mono"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-[11px] text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="estimatedDays" className="text-xs font-medium text-ink">
                Turnaround (days)
              </Label>
              <Input
                id="estimatedDays"
                type="number"
                min="1"
                max="365"
                placeholder="14"
                error={!!errors.estimatedDays}
                className="h-9 text-xs font-mono"
                {...register('estimatedDays', { valueAsNumber: true })}
              />
              {errors.estimatedDays && (
                <p className="text-[11px] text-destructive">{errors.estimatedDays.message}</p>
              )}
            </div>
          </div>

          {/* Soft budget deviation warning banner */}
          {isOverBudget && (
            <div className="p-2.5 rounded-card border border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-[11px] leading-relaxed">
                Your quote of ₹{watchedAmount.toLocaleString('en-IN')} exceeds the client's stated budget of ₹{projectBudget.toLocaleString('en-IN')}. Clients may prioritize bids aligned with their stated budget.
              </p>
            </div>
          )}

          {isSignificantlyBelow && (
            <div className="p-2.5 rounded-card border border-border bg-subtle text-muted-foreground text-xs flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground" />
              <p className="text-[11px] leading-relaxed">
                Your quote is below 50% of the client's budget. Ensure you have budgeted sufficient hours for testing and code quality.
              </p>
            </div>
          )}

          {/* Proposal Textarea with Character Counter */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="proposal" className="text-xs font-medium text-ink">
                Proposal & Technical Approach
              </Label>
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                {watchedProposal.length}/2000
              </span>
            </div>
            <Textarea
              id="proposal"
              rows={5}
              placeholder="Explain your approach, architecture decisions, repository deliverables, and milestone checkpoints..."
              error={!!errors.proposal}
              className="text-xs leading-relaxed"
              {...register('proposal')}
            />
            {errors.proposal && (
              <p className="text-[11px] text-destructive">{errors.proposal.message}</p>
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
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Submit proposal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
