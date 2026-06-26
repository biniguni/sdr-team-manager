"use client";

import { useDraggable } from "@dnd-kit/core";
import { GuestIndicator } from "@/components/lineup/GuestIndicator";
import type { LineupParticipant } from "@/types";

export function PlayerDraggable({
  participant,
  disabled = false,
  compact = false,
}: {
  participant: LineupParticipant;
  disabled?: boolean;
  compact?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `participant:${participant.id}`,
    data: { participant },
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
        compact ? "px-1 py-0.5 text-[10px] sm:px-1.5 sm:py-1 sm:text-[11px]" : "px-3 py-2 text-sm"
      } ${
        isDragging ? "opacity-40" : ""
      }`}
      {...listeners}
      {...attributes}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="truncate font-semibold text-slate-100">
          {participant.number === null ? "" : `#${participant.number} `}
          {participant.name}
        </span>
        {participant.participant_type === "guest" ? <GuestIndicator /> : null}
      </span>
    </button>
  );
}
