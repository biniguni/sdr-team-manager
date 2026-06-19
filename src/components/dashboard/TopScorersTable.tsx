"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import type { PlayerAggregate } from "@/components/dashboard/StatCards";

type SortKey = "goals" | "assists" | "points" | "match_count";

export function TopScorersTable({ players, limit }: { players: PlayerAggregate[]; limit?: number }) {
  const [sortKey, setSortKey] = useState<SortKey>("goals");
  const rows = useMemo(
    () => [...players].filter((row) => row.match_count > 0).sort((a, b) => b[sortKey] - a[sortKey]).slice(0, limit),
    [players, sortKey, limit],
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800 bg-bg-secondary/80">
      <table className="min-w-[620px] w-full border-collapse">
        <thead className="bg-slate-950/70 text-left text-[11px] uppercase tracking-wide text-slate-500">
          <tr>
            <Th>순위</Th>
            <Th>선수</Th>
            <Th center>등번호</Th>
            <Th center onClick={() => setSortKey("match_count")} active={sortKey === "match_count"}>기</Th>
            <Th center onClick={() => setSortKey("goals")} active={sortKey === "goals"}>득점</Th>
            <Th center onClick={() => setSortKey("assists")} active={sortKey === "assists"}>도움</Th>
            <Th center onClick={() => setSortKey("points")} active={sortKey === "points"}>공격포인트</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.player.id} className="border-t border-slate-800 text-sm hover:bg-slate-900/70">
              <td className="px-4 py-3 text-center">
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md font-bold ${rankClass(index)}`}>{index + 1}</span>
              </td>
              <td className="px-4 py-3 font-semibold">
                <span className="flex min-w-0 items-center gap-2 whitespace-nowrap">
                  {row.player.name}
                  {row.player.player_type === "guest" ? <Badge tone="blue">용병</Badge> : null}
                </span>
              </td>
              <td className="px-4 py-3 text-center font-mono text-slate-400">#{row.player.number}</td>
              <td className="px-4 py-3 text-center">{row.match_count}</td>
              <td className="px-4 py-3 text-center font-bold text-accent-blue">{row.goals}</td>
              <td className="px-4 py-3 text-center text-slate-300">{row.assists}</td>
              <td className="px-4 py-3 text-center font-bold text-accent-purple">{row.points}</td>
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">선수 기록이 없습니다.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, center = false, onClick, active = false }: { children: React.ReactNode; center?: boolean; onClick?: () => void; active?: boolean }) {
  return (
    <th className={`whitespace-nowrap px-4 py-3 font-semibold ${center ? "text-center" : ""} ${active ? "text-accent-blue" : ""}`}>
      {onClick ? <button type="button" onClick={onClick}>{children}</button> : children}
    </th>
  );
}

function rankClass(index: number) {
  if (index === 0) return "bg-yellow-400 text-slate-950";
  if (index === 1) return "bg-slate-300 text-slate-950";
  if (index === 2) return "bg-orange-300 text-slate-950";
  return "bg-slate-800 text-slate-300";
}
