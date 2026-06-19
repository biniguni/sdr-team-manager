"use client";

import { PositionSlotDroppable } from "@/components/lineup/PositionSlotDroppable";
import type { Player, PositionSlot } from "@/types";

export function LineupPitch({
  slots,
  assignments,
  playersById,
  canPick = false,
  expanded = false,
  onPickSlot,
  onExpand,
}: {
  slots: PositionSlot[];
  assignments: Record<string, string>;
  playersById: Map<string, Player>;
  canPick?: boolean;
  expanded?: boolean;
  onPickSlot?: (slotId: string) => void;
  onExpand?: () => void;
}) {
  const field = (
    <>
      <div className="absolute inset-4 rounded-lg border border-white/35" />
      <div className="absolute left-1/2 top-4 h-[calc(100%-2rem)] w-px bg-white/25" />
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 ${
          expanded ? "h-28 w-28" : "h-24 w-24"
        }`}
      />
      {slots.map((slot) => {
        const player = playersById.get(assignments[slot.id] ?? "") ?? null;

        if (expanded) {
          return (
            <div
              key={slot.id}
              className="absolute flex min-h-14 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-md border border-emerald-300/70 bg-slate-950/90 px-2 text-center shadow-lg"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              <span className="text-xs font-bold text-accent-green">{slot.position_code}</span>
              <span className="mt-1 max-w-full truncate text-xs font-semibold text-slate-100">
                {player ? `#${player.number} ${player.name}` : "-"}
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
        className="relative block aspect-[7/5] min-h-[360px] w-full overflow-hidden rounded-lg border border-emerald-500/40 bg-emerald-950 text-left"
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
