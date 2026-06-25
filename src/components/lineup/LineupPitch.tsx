"use client";

import { PositionSlotDroppable } from "@/components/lineup/PositionSlotDroppable";
import type { LineupParticipant, PositionSlot } from "@/types";

export function LineupPitch({
  slots,
  assignments,
  participantsById,
  canPick = false,
  expanded = false,
  onPickSlot,
  onExpand,
}: {
  slots: PositionSlot[];
  assignments: Record<string, string>;
  participantsById: Map<string, LineupParticipant>;
  canPick?: boolean;
  expanded?: boolean;
  onPickSlot?: (slotId: string) => void;
  onExpand?: () => void;
}) {
  const field = (
    <>
      <div className="absolute inset-3 rounded-lg border border-white/35 sm:inset-4" />
      <div className="absolute left-1/2 top-3 h-[calc(100%-1.5rem)] w-px bg-white/25 sm:top-4 sm:h-[calc(100%-2rem)]" />
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 ${
          expanded ? "h-24 w-24 sm:h-28 sm:w-28" : "h-16 w-16 sm:h-24 sm:w-24"
        }`}
      />
      {slots.map((slot) => {
        const player = participantsById.get(assignments[slot.id] ?? "") ?? null;

        if (expanded) {
          return (
            <div
              key={slot.id}
              className="absolute flex min-h-12 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-md border border-emerald-300/70 bg-slate-950/90 px-1.5 text-center shadow-lg sm:min-h-14 sm:w-24 sm:px-2"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              <span className="text-xs font-bold text-accent-green">{slot.position_code}</span>
              <span className="mt-0.5 max-w-full truncate text-[10px] font-semibold text-slate-100 sm:mt-1 sm:text-xs">
                {player ? `${player.number === null ? "" : `#${player.number} `}${player.name}` : "-"}
              </span>
            </div>
          );
        }

        return (
          <PositionSlotDroppable
            key={slot.id}
            slot={slot}
            player={player}
            canPick={canPick}
            onPick={() => onPickSlot?.(slot.id)}
          />
        );
      })}
    </>
  );

  if (onExpand) {
    return (
      <div
        role="button"
        tabIndex={0}
        className="relative block aspect-[7/5] min-h-[300px] w-full max-w-full overflow-hidden rounded-lg border border-emerald-500/40 bg-emerald-950 text-left sm:min-h-[360px]"
        aria-label="라인업 확대"
        onClick={onExpand}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onExpand();
          }
        }}
      >
        {field}
      </div>
    );
  }

  return (
    <div className="relative min-h-0 overflow-hidden rounded-lg border border-emerald-500/40 bg-emerald-950">
      {field}
    </div>
  );
}
