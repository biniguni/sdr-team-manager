"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { calculateMatchResult, formatMatchResult, resultTone } from "@/lib/matches";
import type { Match } from "@/types";

function formatMatchDate(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function hasUnsavedLineupChanges() {
  return Boolean((window as unknown as { lineupHasUnsavedChanges?: boolean }).lineupHasUnsavedChanges);
}

export function LineupMatchCards({
  matches,
  selectedMatchId,
}: {
  matches: Match[];
  selectedMatchId: string;
}) {
  return (
    <div className="-mx-4 flex max-w-[100vw] gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:max-w-full sm:px-0">
      {matches.map((match) => {
        const selected = match.id === selectedMatchId;
        const result = calculateMatchResult(match.our_score, match.opponent_score);
        return (
          <Link
            key={match.id}
            href={`/lineup?matchId=${match.id}`}
            onClick={(event) => {
              if (selected || !hasUnsavedLineupChanges()) return;
              const ok = window.confirm("저장하지 않은 변경사항이 있습니다. 저장하지 않고 이동할까요?");
              if (!ok) event.preventDefault();
            }}
            className={`min-w-56 max-w-[calc(100vw-2rem)] rounded-lg border p-3 transition ${
              selected ? "border-accent-blue bg-sky-950/40" : "border-slate-800 bg-bg-secondary hover:border-slate-600"
            }`}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <Badge tone={match.status === "completed" ? "green" : "blue"}>{match.status === "completed" ? "완료" : "예정"}</Badge>
              {match.status === "completed" ? <Badge tone={resultTone(result)}>{formatMatchResult(result)}</Badge> : null}
            </div>
            <div className="font-semibold text-slate-100">vs {match.opponent || "상대 미정"}</div>
            <div className="mt-1 text-xs text-slate-400">{formatMatchDate(match.match_date)}</div>
          </Link>
        );
      })}
    </div>
  );
}
