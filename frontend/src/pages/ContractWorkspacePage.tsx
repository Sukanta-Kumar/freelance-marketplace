import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContract, useCompleteContract } from '@/features/contracts/hooks/useContracts';
import {
  useContractMilestones,
  useStartMilestone,
  useApproveMilestone,
} from '@/features/milestones/hooks/useMilestones';
import { useUser } from '@/features/auth/hooks/useUser';
import { useAuthStore } from '@/stores/authStore';
import { milestoneActions } from '@/lib/permissions';
import { MilestoneResponse } from '@/types/api';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyText } from '@/components/shared/MoneyText';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { MilestoneRail } from '@/components/shared/MilestoneRail';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { AddMilestoneDialog } from '@/features/milestones/components/AddMilestoneDialog';
import { SubmitWorkDialog } from '@/features/milestones/components/SubmitWorkDialog';
import { RejectWorkDialog } from '@/features/milestones/components/RejectWorkDialog';
import { PaymentReceiptDialog } from '@/features/milestones/components/PaymentReceiptDialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  FileText,
  Play,
  Plus,
  Send,
  Flag,
} from 'lucide-react';

export default function ContractWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const contractId = Number(id) || 1;

  const { role, userId } = useAuthStore();

  // Queries
  const { data: contract, isLoading: contractLoading, isError: contractError } = useContract(contractId);
  const { data: milestones = [], isLoading: milestonesLoading } = useContractMilestones(contractId);

  const { user: clientUser } = useUser(contract?.clientId);
  const { user: freelancerUser } = useUser(contract?.freelancerId);

  // Mutations
  const startMilestoneMutation = useStartMilestone(contractId);
  const approveMilestoneMutation = useApproveMilestone(contractId);
  const completeContractMutation = useCompleteContract(contractId);

  // Selected milestone inspector
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<number | null>(null);

  // Dialog states
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [submittingMilestone, setSubmittingMilestone] = useState<MilestoneResponse | null>(null);
  const [rejectingMilestone, setRejectingMilestone] = useState<MilestoneResponse | null>(null);
  const [approvingMilestone, setApprovingMilestone] = useState<MilestoneResponse | null>(null);
  const [receiptMilestone, setReceiptMilestone] = useState<MilestoneResponse | null>(null);
  const [isCompleteContractConfirmOpen, setIsCompleteContractConfirmOpen] = useState(false);

  // Active milestone resolution: defaults to submitted or in_progress milestone, or first
  const activeMilestone =
    milestones.find((m) => m.id === selectedMilestoneId) ||
    milestones.find((m) => m.status === 'SUBMITTED' || m.status === 'IN_PROGRESS') ||
    milestones[0];

  // Party checks
  const isClientParty =
    role === 'CLIENT' || String(userId) === String(contract?.clientId);
  const isFreelancerParty =
    role === 'FREELANCER' || String(userId) === String(contract?.freelancerId);
  const isParty = isClientParty || isFreelancerParty;

  // Derive allowed actions using pure permissions function
  const actions = activeMilestone
    ? milestoneActions(role, activeMilestone.status, isParty)
    : {
        canStart: false,
        canSubmit: false,
        canResubmit: false,
        canApprove: false,
        canReject: false,
        canEdit: false,
      };

  // Calculations
  const totalPaid = milestones
    .filter((m) => m.status === 'PAID')
    .reduce((acc, m) => acc + m.amount, 0);

  const allocatedAmount = milestones.reduce((acc, m) => acc + m.amount, 0);
  const totalContractAmount = contract?.totalAmount || 0;
  const remainingBudget = Math.max(0, totalContractAmount - allocatedAmount);
  const totalInEscrow = Math.max(0, totalContractAmount - totalPaid);

  const allMilestonesPaid =
    milestones.length > 0 && milestones.every((m) => m.status === 'PAID');
  const canCompleteContract =
    isClientParty && contract?.status === 'ACTIVE' && allMilestonesPaid;

  const handleApproveConfirm = async () => {
    if (!approvingMilestone) return;
    const target = approvingMilestone;
    await approveMilestoneMutation.mutateAsync(target.id);
    setApprovingMilestone(null);
    setReceiptMilestone(target);
  };

  const handleCompleteContract = async () => {
    await completeContractMutation.mutateAsync();
    setIsCompleteContractConfirmOpen(false);
  };

  if (contractLoading || milestonesLoading) {
    return (
      <div className="space-y-6 max-w-6xl">
        <Skeleton className="h-4 w-48 rounded" />
        <Skeleton className="h-8 w-80 rounded" />
        <Skeleton className="h-24 rounded-card" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <Skeleton className="h-96 rounded-card lg:col-span-8" />
          <Skeleton className="h-64 rounded-card lg:col-span-4" />
        </div>
      </div>
    );
  }

  if (contractError || !contract) {
    return (
      <div className="p-8 text-center space-y-3 max-w-md mx-auto my-12 rounded-card border border-border bg-surface">
        <AlertCircle className="w-6 h-6 text-destructive mx-auto" />
        <h2 className="text-sm font-semibold">Contract workspace not found</h2>
        <p className="text-xs text-muted-foreground">
          The requested contract record does not exist or has been removed.
        </p>
        <Button asChild size="sm" variant="outline" className="h-8 text-xs">
          <Link to="/contracts">Return to contracts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
        <Link to="/contracts" className="hover:text-ink transition-colors">
          Contracts
        </Link>
        <span>/</span>
        <span className="text-ink font-medium">Contract #{contract.id}</span>
      </nav>

      {/* Header */}
      <PageHeader
        title={`Contract #${contract.id} — Milestone Workspace`}
        description="Sequential milestone tracking, deliverable verification, and automated escrow payouts."
        badge={<StatusBadge status={contract.status} size="sm" />}
        actions={
          isClientParty && contract.status === 'ACTIVE' && remainingBudget > 0 ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium"
              onClick={() => setIsAddMilestoneOpen(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add milestone
            </Button>
          ) : undefined
        }
      />

      {/* Minimal Milestone Rail Strip */}
      <div className="border border-border rounded-card bg-surface p-4 sm:p-5">
        <div className="flex items-center justify-between pb-2 border-b border-border/80 text-xs">
          <span className="font-semibold text-ink">Milestone Progress Rail</span>
          <span className="text-muted-foreground font-mono text-[11px]">
            {milestones.filter((m) => m.status === 'PAID').length} of {milestones.length} settled
          </span>
        </div>

        <MilestoneRail
          milestones={milestones}
          activeMilestoneId={activeMilestone?.id}
          onSelectMilestone={(m) => setSelectedMilestoneId(m.id)}
        />
      </div>

      {/* 2-Column Asymmetric Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Milestone Inspector & Milestones Table (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Milestone Inspector */}
          {activeMilestone ? (
            <div className="border border-border rounded-card bg-surface p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-border">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                    Milestone #{activeMilestone.sequenceNumber}
                  </span>
                  <h3 className="text-base font-semibold text-ink mt-0.5">
                    {activeMilestone.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={activeMilestone.status} size="sm" />
                  <MoneyText amount={activeMilestone.amount} size="md" className="font-mono font-bold text-ink" />
                </div>
              </div>

              {/* Scope & Specification */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                  Deliverable Specification
                </span>
                <p className="text-xs text-ink leading-relaxed">
                  {activeMilestone.description || 'Deliverables and acceptance criteria defined under contract brief.'}
                </p>
              </div>

              {/* Submitted Deliverable (if submitted or paid) */}
              {activeMilestone.submissionDescription && (
                <div className="p-3.5 rounded-card bg-muted/20 border border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-ink flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                      Submitted Deliverable
                    </span>
                    {activeMilestone.deliverableUrl && (
                      <a
                        href={activeMilestone.deliverableUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent hover:underline font-mono text-[11px] flex items-center gap-1"
                      >
                        <span>Inspect repository / preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {activeMilestone.submissionDescription}
                  </p>
                </div>
              )}

              {/* Rejection / Revision Reason if REJECTED */}
              {activeMilestone.rejectionReason && (
                <div className="p-3 rounded-card bg-rose-50/20 border border-destructive/20 text-xs text-destructive space-y-1">
                  <span className="font-medium flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Revision Requested by Client:
                  </span>
                  <p className="text-[11px] leading-relaxed text-ink/80">
                    {activeMilestone.rejectionReason}
                  </p>
                </div>
              )}

              {/* Action Buttons: Derived strictly from milestoneActions */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-border">
                {/* Freelancer: Start Milestone */}
                {actions.canStart && (
                  <Button
                    variant="accent"
                    size="sm"
                    className="h-8 text-xs font-medium"
                    isLoading={startMilestoneMutation.isPending}
                    onClick={() => startMilestoneMutation.mutate(activeMilestone.id)}
                  >
                    <Play className="w-3.5 h-3.5 mr-1" />
                    Start milestone
                  </Button>
                )}

                {/* Freelancer: Submit Deliverable (first submission) */}
                {actions.canSubmit && (
                  <Button
                    variant="accent"
                    size="sm"
                    className="h-8 text-xs font-medium"
                    onClick={() => setSubmittingMilestone(activeMilestone)}
                  >
                    <Send className="w-3.5 h-3.5 mr-1" />
                    Submit for review
                  </Button>
                )}

                {/* Freelancer: Resubmit Deliverable (after rejection) */}
                {actions.canResubmit && (
                  <Button
                    variant="accent"
                    size="sm"
                    className="h-8 text-xs font-medium"
                    onClick={() => setSubmittingMilestone(activeMilestone)}
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    Submit revised deliverable
                  </Button>
                )}

                {/* Client: Request Revision */}
                {actions.canReject && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-medium"
                    onClick={() => setRejectingMilestone(activeMilestone)}
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                    Request revision
                  </Button>
                )}

                {/* Client: Release Escrow Payment */}
                {actions.canApprove && (
                  <Button
                    variant="accent"
                    size="sm"
                    className="h-8 text-xs font-medium"
                    onClick={() => setApprovingMilestone(activeMilestone)}
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Release payment ({`₹${activeMilestone.amount.toLocaleString('en-IN')}`})
                  </Button>
                )}

                {/* Settled / Paid State Indicator */}
                {activeMilestone.status === 'PAID' && (
                  <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Escrow payment settled to engineer</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border border-border rounded-card bg-surface p-8 text-center text-xs text-muted-foreground">
              No milestones defined yet.
            </div>
          )}

          {/* Milestones Hairline Table */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-ink">All Contract Milestones</span>
            <div className="border border-border rounded-card overflow-hidden bg-surface">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-mono uppercase text-[11px] tracking-wider select-none">
                  <tr>
                    <th className="py-2.5 px-3 font-normal">#</th>
                    <th className="py-2.5 px-3 font-normal">Milestone</th>
                    <th className="py-2.5 px-3 font-normal">Status</th>
                    <th className="py-2.5 px-3 font-normal text-right">Amount</th>
                    <th className="py-2.5 px-3 font-normal text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {milestones.map((m) => (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedMilestoneId(m.id)}
                      className={`hover:bg-muted/20 transition-colors cursor-pointer h-10 ${
                        activeMilestone?.id === m.id ? 'bg-muted/30' : ''
                      }`}
                    >
                      <td className="py-2 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        M{m.sequenceNumber}
                      </td>

                      <td className="py-2 px-3">
                        <span className="font-medium text-ink block truncate max-w-xs sm:max-w-md">
                          {m.title}
                        </span>
                      </td>

                      <td className="py-2 px-3 whitespace-nowrap">
                        <StatusBadge status={m.status} size="sm" />
                      </td>

                      <td className="py-2 px-3 text-right font-mono tabular-nums whitespace-nowrap font-medium text-ink">
                        <MoneyText amount={m.amount} size="sm" />
                      </td>

                      <td className="py-2 px-3 text-right whitespace-nowrap">
                        <span className="text-[11px] text-accent hover:underline font-medium">
                          {activeMilestone?.id === m.id ? 'Active' : 'Inspect'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Narrow Sticky Summary Sidebar (lg:col-span-4) */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <Card className="p-4 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                Total Contract Escrow
              </span>
              <MoneyText
                amount={contract.totalAmount}
                size="xl"
                className="font-bold text-ink mt-0.5"
              />
            </div>

            {/* Escrow Ledger Breakdown */}
            <div className="border-t border-border pt-3 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Released to date:</span>
                <span className="text-ink font-medium">₹{totalPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Reserved in escrow:</span>
                <span className="text-ink font-semibold">₹{totalInEscrow.toLocaleString('en-IN')}</span>
              </div>
              {remainingBudget > 0 && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Unallocated:</span>
                  <span className="text-accent font-medium">₹{remainingBudget.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Parties */}
            <div className="border-t border-border pt-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Client sponsor</span>
                <div className="flex items-center gap-1.5 font-medium text-ink">
                  <UserAvatar name={clientUser?.fullName} size="xs" />
                  <span className="truncate max-w-[120px]">{clientUser?.fullName || 'Client'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Engineer</span>
                <div className="flex items-center gap-1.5 font-medium text-ink">
                  <UserAvatar name={freelancerUser?.fullName} size="xs" />
                  <span className="truncate max-w-[120px]">{freelancerUser?.fullName || 'Engineer'}</span>
                </div>
              </div>
            </div>

            {/* Escrow Guarantee Badge */}
            <div className="border-t border-border pt-3">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Protected by WorkCraft milestone escrow ledger</span>
              </div>
            </div>

            {/* Complete Contract CTA if all milestones settled */}
            {canCompleteContract && (
              <div className="border-t border-border pt-3">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full h-8 text-xs font-medium"
                  onClick={() => setIsCompleteContractConfirmOpen(true)}
                >
                  <Flag className="w-3.5 h-3.5 mr-1.5" />
                  Close & Complete Contract
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Add Milestone Dialog */}
      <AddMilestoneDialog
        open={isAddMilestoneOpen}
        onOpenChange={setIsAddMilestoneOpen}
        contractId={contract.id}
        totalContractBudget={contract.totalAmount}
        allocatedAmount={allocatedAmount}
        nextSequenceNumber={milestones.length + 1}
      />

      {/* Submit / Resubmit Deliverable Dialog */}
      <SubmitWorkDialog
        open={!!submittingMilestone}
        onOpenChange={(open) => !open && setSubmittingMilestone(null)}
        contractId={contract.id}
        milestone={submittingMilestone}
      />

      {/* Request Revision Dialog */}
      <RejectWorkDialog
        open={!!rejectingMilestone}
        onOpenChange={(open) => !open && setRejectingMilestone(null)}
        contractId={contract.id}
        milestone={rejectingMilestone}
      />

      {/* Release Payment ConfirmDialog */}
      <ConfirmDialog
        open={!!approvingMilestone}
        onOpenChange={(open) => !open && setApprovingMilestone(null)}
        title="Release milestone payout"
        description={
          approvingMilestone
            ? `Release ₹${approvingMilestone.amount.toLocaleString(
                'en-IN'
              )} from escrow to ${freelancerUser?.fullName || 'the engineer'} for "${approvingMilestone.title}"? This transfer is final.`
            : ''
        }
        confirmLabel="Release payment"
        variant="default"
        isLoading={approveMilestoneMutation.isPending}
        onConfirm={handleApproveConfirm}
      />

      {/* Payment Released Confirmation Modal */}
      <PaymentReceiptDialog
        open={!!receiptMilestone}
        onOpenChange={(open) => !open && setReceiptMilestone(null)}
        contractId={contract.id}
        milestone={receiptMilestone}
        recipientName={freelancerUser?.fullName}
      />

      {/* Complete Contract ConfirmDialog */}
      <ConfirmDialog
        open={isCompleteContractConfirmOpen}
        onOpenChange={setIsCompleteContractConfirmOpen}
        title="Complete and close contract"
        description="All deliverables have been approved and funds released. Mark this contract as successfully closed?"
        confirmLabel="Complete contract"
        variant="default"
        isLoading={completeContractMutation.isPending}
        onConfirm={handleCompleteContract}
      />
    </div>
  );
}
