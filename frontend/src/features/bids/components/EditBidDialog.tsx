import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bidSchema, BidFormValues } from '../schemas/bidSchemas';
import { useUpdateBid } from '../hooks/useBids';
import { BidResponse } from '@/types/api';
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

interface EditBidDialogProps {
  bid: BidResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: number;
}

export function EditBidDialog({
  bid,
  open,
  onOpenChange,
  projectId,
}: EditBidDialogProps) {
  const updateMutation = useUpdateBid(projectId);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    mode: 'onBlur',
    values: bid
      ? {
          amount: bid.amount,
          estimatedDays: bid.estimatedDays,
          proposal: bid.proposal,
        }
      : undefined,
  });

  const watchedAmount = watch('amount');
  const watchedProposal = watch('proposal') || '';

  const onSubmit = async (values: BidFormValues) => {
    if (!bid) return;
    await updateMutation.mutateAsync({
      id: bid.id,
      payload: {
        amount: values.amount,
        estimatedDays: values.estimatedDays,
        proposal: values.proposal,
      },
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit proposal</DialogTitle>
          <DialogDescription>
            Update your quote or deliverable turnaround before client review.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="editBidAmount" className="text-xs font-medium text-ink">
                  Quote (INR)
                </Label>
                {typeof watchedAmount === 'number' && watchedAmount > 0 && (
                  <MoneyText amount={watchedAmount} size="xs" className="font-mono text-[11px] text-muted-foreground" />
                )}
              </div>
              <Input
                id="editBidAmount"
                type="number"
                step="500"
                min="500"
                error={!!errors.amount}
                className="h-9 text-xs font-mono"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-[11px] text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="editEstimatedDays" className="text-xs font-medium text-ink">
                Turnaround (days)
              </Label>
              <Input
                id="editEstimatedDays"
                type="number"
                min="1"
                max="365"
                error={!!errors.estimatedDays}
                className="h-9 text-xs font-mono"
                {...register('estimatedDays', { valueAsNumber: true })}
              />
              {errors.estimatedDays && (
                <p className="text-[11px] text-destructive">{errors.estimatedDays.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="editProposal" className="text-xs font-medium text-ink">
                Proposal & Approach
              </Label>
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                {watchedProposal.length}/2000
              </span>
            </div>
            <Textarea
              id="editProposal"
              rows={5}
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
              size="sm"
              className="h-8 text-xs font-medium"
              isLoading={updateMutation.isPending}
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
