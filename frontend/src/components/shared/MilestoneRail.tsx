import React from 'react';
import { MilestoneResponse } from '@/types/api';
import { MoneyText } from '@/components/shared/MoneyText';

interface MilestoneRailProps {
  milestones: MilestoneResponse[];
  activeMilestoneId?: number;
  onSelectMilestone?: (milestone: MilestoneResponse) => void;
}

export function MilestoneRail({
  milestones,
  activeMilestoneId,
  onSelectMilestone,
}: MilestoneRailProps) {
  if (!milestones || milestones.length === 0) return null;

  return (
    <div className="w-full py-3">
      {/* Rail Container */}
      <div className="relative flex items-start justify-between">
        {/* Background Connecting 2px Line */}
        <div className="absolute top-[5px] left-3 right-3 h-[2px] bg-border -z-0" />

        {milestones.map((m, idx) => {
          const isPaid = m.status === 'PAID';
          const isCurrent =
            m.id === activeMilestoneId ||
            (!activeMilestoneId && (m.status === 'IN_PROGRESS' || m.status === 'SUBMITTED'));
          const isSelected = m.id === activeMilestoneId;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMilestone?.(m)}
              className="relative z-10 flex flex-col items-center text-center group focus:outline-none max-w-[120px] sm:max-w-[160px] cursor-pointer"
            >
              {/* 10px Node: filled = paid, ringed = current, muted = pending */}
              <div className="h-3 flex items-center justify-center">
                {isPaid ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400 block transition-transform group-hover:scale-125" />
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-accent bg-surface block ring-2 ring-accent/20 transition-transform group-hover:scale-125" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full border border-border bg-surface block transition-transform group-hover:scale-125" />
                )}
              </div>

              {/* Number and Title Below */}
              <div className="mt-2 space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                  M{m.sequenceNumber || idx + 1} • {m.status.toLowerCase()}
                </span>
                <span
                  className={`text-xs block line-clamp-1 transition-colors ${
                    isSelected ? 'font-semibold text-ink' : 'font-normal text-muted-foreground group-hover:text-ink'
                  }`}
                >
                  {m.title}
                </span>
                <MoneyText
                  amount={m.amount}
                  size="xs"
                  className="font-mono text-muted-foreground block text-[11px]"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
