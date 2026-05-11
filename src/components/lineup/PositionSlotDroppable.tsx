"use client";

import { useDroppable } from "@dnd-kit/core";
import { PlayerDraggable } from "@/components/lineup/PlayerDraggable";
import type { Player, PositionSlot } from "@/types";

export function PositionSlotDroppable({
  slot,
  player,
}: {
  slot: PositionSlot;
  player: Player | null;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `slot:${slot.id}`,
    data: { slot },
  });

  return (
    <div
      ref={setNodeRef}
      className={`absolute flex h-16 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-md border px-2 text-center shadow-lg transition ${
        isOver
          ? "border-accent-blue bg-sky-950 text-white"
          : "border-emerald-300/60 bg-slate-950/85 text-slate-100"
      }`}
      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
    >
      <span className="text-xs font-bold text-accent-green">{slot.position_code}</span>
      <div className="mt-1 w-full">
        {player ? <PlayerDraggable player={player} compact /> : <span className="text-xs text-slate-400">Empty</span>}
      </div>
    </div>
  );
}
