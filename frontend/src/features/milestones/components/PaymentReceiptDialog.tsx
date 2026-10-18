import React from 'react';
import { MilestoneResponse } from '@/types/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Check } from 'lucide-react';

interface PaymentReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: number;
  milestone: MilestoneResponse | null;
  recipientName?: string;
}

export function PaymentReceiptDialog({
  open,
  onOpenChange,
  contractId,
  milestone,
  recipientName,
}: PaymentReceiptDialogProps) {
  if (!milestone) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="text-center pt-2 pb-1 space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <DialogTitle className="text-base font-semibold text-ink">Payment Released</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Escrow funds have been settled directly to the engineer's ledger.
          </DialogDescription>
        </div>

        {/* Quiet Utility Receipt Card */}
        <div className="rounded-card border border-border bg-muted/20 p-3.5 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Receipt ref</span>
            <span className="text-ink">TXN-{contractId}-{milestone.id}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Milestone #{milestone.sequenceNumber}</span>
            <span className="text-ink truncate max-w-[200px]">{milestone.title}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Recipient</span>
            <span className="text-ink">{recipientName || 'Verified Engineer'}</span>
          </div>
          <div className="border-t border-border pt-2 flex items-center justify-between font-semibold text-ink">
            <span>Amount settled</span>
            <span className="text-sm">₹{milestone.amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            className="w-full h-8 text-xs font-medium"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
