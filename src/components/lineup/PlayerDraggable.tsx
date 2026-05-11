"use client";

import { useDraggable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/Badge";
import type { Player } from "@/types";

export function PlayerDraggable({
  player,
  disabled = false,
  compact = false,
}: {
  player: Player;
  disabled?: boolean;
  compact?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `player:${player.id}`,
    data: { player },
    disabled,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, touchAction: "none" }
    : { touchAction: "none" };

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      className={`w-full cursor-grab select-none rounded-md border border-slate-700 bg-slate-950 text-left transition hover:border-accent-blue active:cursor-grabbing ${
        compact ? "px-1.5 py-1 text-[11px]" : "px-3 py-2 text-sm"
      } ${
        isDragging ? "opacity-40" : ""
      }`}
      {...listeners}
      {...attributes}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="truncate font-semibold text-slate-100">#{player.number} {player.name}</span>
        {player.player_type === "guest" ? <Badge tone="blue">용병</Badge> : null}
      </span>
    </button>
  );
}
