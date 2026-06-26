"use client";

import { useMemo, useState } from "react";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PlayerAggregate } from "@/components/dashboard/StatCards";
import type { PlayerStatsRow } from "@/lib/dashboard";
import type { Match, PositionPerformance } from "@/types";

type TrendKey = "appearances" | "goals" | "assists";
type SortKey = "match_count" | "win_rate" | "goals" | "assists" | "clean_sheets" | "mom_count";

type PositionRow = Pick<PositionPerformance, "player_id" | "position_code" | "period_count" | "match_count" | "goals" | "assists">;

const pieColors = ["#38bdf8", "#22c55e", "#a78bfa", "#f97316", "#facc15", "#fb7185", "#94a3b8"];

export function RankingView({
  players,
  matches,
  stats,
  positionRows,
}: {
  players: PlayerAggregate[];
  matches: Match[];
  stats: PlayerStatsRow[];
  positionRows: PositionRow[];
}) {
  const [sortKey, setSortKey] = useState<SortKey>("goals");
  const [selectedPlayerId, setSelectedPlayerId] = useState(players[0]?.player.id ?? "");
  const [trendKey, setTrendKey] = useState<TrendKey>("appearances");

  const rows = useMemo(
    () =>
      players
        .map((player) => buildRankingRow(player, stats, matches))
        .filter((row) => row.match_count > 0 || row.mom_count > 0)
        .sort((a, b) => b[sortKey] - a[sortKey]),
    [players, stats, matches, sortKey],
  );
  const selected = rows.find((row) => row.player.id === selectedPlayerId) ?? rows[0] ?? null;
  const selectedStats = selected ? stats.filter((row) => row.player_id === selected.player.id) : [];
  const selectedPositions = selected ? positionRows.filter((row) => row.player_id === selected.player.id) : [];
  const trendData = selected ? buildTrendData(selected.player.id, matches, selectedStats, trendKey) : [];
  const opponentRows = selected ? buildOpponentRows(selected.player.id, matches, selectedStats) : [];
  const positionalMom = selected ? countPositionalMom(selected.player.id, matches) : { defense: 0, midfield: 0, attack: 0 };

  return (
    <div className="grid gap-5">
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-bg-secondary/80">
        <table className="w-full min-w-[760px] border-collapse xl:min-w-0">
          <thead className="bg-slate-950/70 text-left text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <Th sticky="rank">순위</Th>
              <Th sticky="player">선수</Th>
              <Th center>등번호</Th>
              <Th center onClick={() => setSortKey("match_count")} active={sortKey === "match_count"}>출전</Th>
              <Th center onClick={() => setSortKey("win_rate")} active={sortKey === "win_rate"}>승률</Th>
              <Th center onClick={() => setSortKey("goals")} active={sortKey === "goals"}>득점</Th>
              <Th center onClick={() => setSortKey("assists")} active={sortKey === "assists"}>도움</Th>
              <Th center onClick={() => setSortKey("clean_sheets")} active={sortKey === "clean_sheets"}>무실점</Th>
              <Th center onClick={() => setSortKey("mom_count")} active={sortKey === "mom_count"}>MOM</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.player.id} className={`border-t border-slate-800 text-sm hover:bg-slate-900/70 ${selected?.player.id === row.player.id ? "bg-sky-950/25" : ""}`}>
                <td className="sticky left-0 z-10 w-[64px] bg-bg-secondary/95 px-3 py-3 text-center xl:static xl:bg-transparent">
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md font-bold ${rankClass(index)}`}>{index + 1}</span>
                </td>
                <td className="sticky left-[64px] z-10 w-[132px] bg-bg-secondary/95 px-3 py-3 font-semibold xl:static xl:w-auto xl:bg-transparent xl:px-4">
                  <button type="button" className="max-w-[120px] truncate text-left text-slate-100 hover:text-accent-blue" onClick={() => setSelectedPlayerId(row.player.id)}>
                    {row.player.name}
                  </button>
                </td>
                <td className="px-4 py-3 text-center font-mono text-slate-400">#{row.player.number}</td>
                <td className="px-4 py-3 text-center">{row.match_count}</td>
                <td className="px-4 py-3 text-center">{row.win_rate}%</td>
                <td className="px-4 py-3 text-center font-bold text-accent-blue">{row.goals}</td>
                <td className="px-4 py-3 text-center text-slate-300">{row.assists}</td>
                <td className="px-4 py-3 text-center text-accent-green">{row.clean_sheets}</td>
                <td className="px-4 py-3 text-center font-bold text-accent-purple">{row.mom_count}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-sm text-slate-500">선수 기록이 없습니다.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {selected ? (
        <section className="grid gap-4 rounded-lg border border-slate-800 bg-bg-secondary/80 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950 p-4">
            <div>
              <h2 className="text-xl font-black text-slate-100">{selected.player.name}</h2>
              <p className="mt-1 text-sm text-slate-400">
                #{selected.player.number} · 출전률 {selected.appearance_rate}% · MOM {selected.mom_count}회
              </p>
            </div>
            <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-accent-purple">
              MOM {selected.mom_count}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            <MetricCard label="출전" value={`${selected.match_count}`} />
            <MetricCard label="승률" value={`${selected.win_rate}%`} />
            <MetricCard label="득점" value={`${selected.goals}`} tone="text-accent-blue" />
            <MetricCard label="도움" value={`${selected.assists}`} tone="text-accent-orange" />
            <MetricCard label="무실점" value={`${selected.clean_sheets}`} tone="text-accent-green" />
            <MetricCard label="MOM" value={`${selected.mom_count}`} tone="text-accent-purple" />
          </div>

          <section className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-bold text-slate-100">기록 추이</h3>
              <div className="flex rounded-md border border-slate-800 bg-bg-primary p-1">
                <TrendButton active={trendKey === "appearances"} onClick={() => setTrendKey("appearances")}>출전수</TrendButton>
                <TrendButton active={trendKey === "goals"} onClick={() => setTrendKey("goals")}>득점</TrendButton>
                <TrendButton active={trendKey === "assists"} onClick={() => setTrendKey("assists")}>도움</TrendButton>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ left: -16, right: 16, top: 8, bottom: 0 }}>
                  <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid #1e293b", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="grid gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <h3 className="text-base font-bold text-slate-100">포지션 분석</h3>
              <div className="mt-4 h-64">
                {selectedPositions.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={selectedPositions} dataKey="match_count" nameKey="position_code" innerRadius={48} outerRadius={88} paddingAngle={3}>
                        {selectedPositions.map((row, index) => (
                          <Cell key={row.position_code} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#020617", border: "1px solid #1e293b", borderRadius: 8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="grid h-full place-items-center text-sm font-semibold text-slate-500">포지션 데이터 없음</div>
                )}
              </div>
            </div>
            <div className="grid content-start gap-3">
              <h4 className="text-sm font-bold text-slate-200">포지션별 공격포인트</h4>
              <div className="grid gap-2">
                {selectedPositions.map((row) => (
                  <div key={row.position_code} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-md border border-slate-800 bg-bg-primary px-3 py-2 text-sm">
                    <span className="font-bold text-accent-green">{row.position_code}</span>
                    <span className="text-slate-400">출전 {row.match_count}</span>
                    <span className="font-bold text-accent-purple">공격P {(row.goals ?? 0) + (row.assists ?? 0)}</span>
                  </div>
                ))}
                {selectedPositions.length === 0 ? <p className="text-sm text-slate-500">저장된 포지션 출전 기록이 없습니다.</p> : null}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <MetricCard label="수비 MOM" value={`${positionalMom.defense}`} compact />
                <MetricCard label="미드 MOM" value={`${positionalMom.midfield}`} compact />
                <MetricCard label="공격 MOM" value={`${positionalMom.attack}`} compact />
              </div>
            </div>
          </section>

          <section className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-4">
            <h3 className="mb-3 text-base font-bold text-slate-100">상대팀 성적</h3>
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead className="text-left text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">상대팀</th>
                  <th className="px-3 py-2 text-center">출전</th>
                  <th className="px-3 py-2 text-center">승률</th>
                  <th className="px-3 py-2 text-center">득점</th>
                  <th className="px-3 py-2 text-center">도움</th>
                  <th className="px-3 py-2 text-center">무실점</th>
                  <th className="px-3 py-2 text-center">MOM</th>
                </tr>
              </thead>
              <tbody>
                {opponentRows.map((row) => (
                  <tr key={row.opponent} className="border-t border-slate-800">
                    <td className="px-3 py-3 font-bold text-slate-100">{row.opponent}</td>
                    <td className="px-3 py-3 text-center">{row.match_count}</td>
                    <td className="px-3 py-3 text-center">{row.win_rate}%</td>
                    <td className="px-3 py-3 text-center text-accent-blue">{row.goals}</td>
                    <td className="px-3 py-3 text-center">{row.assists}</td>
                    <td className="px-3 py-3 text-center text-accent-green">{row.clean_sheets}</td>
                    <td className="px-3 py-3 text-center font-bold text-accent-purple">{row.mom_count}</td>
                  </tr>
                ))}
                {opponentRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-sm text-slate-500">상대팀 기록이 없습니다.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </section>
        </section>
      ) : null}
    </div>
  );
}

function buildRankingRow(player: PlayerAggregate, stats: PlayerStatsRow[], matches: Match[]) {
  const playerStats = stats.filter((row) => row.player_id === player.player.id && row.played);
  const playedMatchIds = new Set(playerStats.map((row) => row.match_id));
  const playedMatches = matches.filter((match) => playedMatchIds.has(match.id));
  const wins = playedMatches.filter((match) => (match.our_score ?? -1) > (match.opponent_score ?? -1)).length;
  const cleanSheets = playedMatches.filter((match) => match.opponent_score === 0).length;
  const completedCount = playedMatches.filter((match) => match.our_score !== null && match.opponent_score !== null).length;

  return {
    ...player,
    win_rate: completedCount ? Math.round((wins / completedCount) * 100) : 0,
    appearance_rate: matches.length ? Math.round((player.match_count / matches.length) * 100) : 0,
    clean_sheets: cleanSheets,
  };
}

function buildTrendData(playerId: string, matches: Match[], stats: PlayerStatsRow[], trendKey: TrendKey) {
  const statsByMatchId = new Map(stats.map((row) => [row.match_id, row]));
  let appearanceTotal = 0;

  return [...matches]
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime())
    .map((match) => {
      const stat = statsByMatchId.get(match.id);
      if (trendKey === "appearances" && stat?.played) appearanceTotal += 1;
      const value = trendKey === "appearances" ? appearanceTotal : trendKey === "goals" ? (stat?.goals ?? 0) : (stat?.assists ?? 0);
      return {
        label: new Date(match.match_date).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" }),
        value,
        opponent: match.opponent,
        playerId,
      };
    });
}

function buildOpponentRows(playerId: string, matches: Match[], stats: PlayerStatsRow[]) {
  const statsByMatchId = new Map(stats.filter((row) => row.played).map((row) => [row.match_id, row]));
  const groups = new Map<string, { opponent: string; match_count: number; wins: number; completed: number; goals: number; assists: number; clean_sheets: number; mom_count: number }>();

  for (const match of matches) {
    const stat = statsByMatchId.get(match.id);
    if (!stat) continue;

    const current = groups.get(match.opponent) ?? {
      opponent: match.opponent,
      match_count: 0,
      wins: 0,
      completed: 0,
      goals: 0,
      assists: 0,
      clean_sheets: 0,
      mom_count: 0,
    };

    current.match_count += 1;
    current.goals += stat.goals;
    current.assists += stat.assists;
    if (match.our_score !== null && match.opponent_score !== null) {
      current.completed += 1;
      if (match.our_score > match.opponent_score) current.wins += 1;
      if (match.opponent_score === 0) current.clean_sheets += 1;
    }
    if (match.match_mom_player_id === playerId) current.mom_count += 1;
    groups.set(match.opponent, current);
  }

  return [...groups.values()]
    .map((row) => ({ ...row, win_rate: row.completed ? Math.round((row.wins / row.completed) * 100) : 0 }))
    .sort((a, b) => b.match_count - a.match_count || b.goals - a.goals);
}

function countPositionalMom(playerId: string, matches: Match[]) {
  return matches.reduce(
    (totals, match) => ({
      defense: totals.defense + (match.defense_mom_player_id === playerId ? 1 : 0),
      midfield: totals.midfield + (match.midfield_mom_player_id === playerId ? 1 : 0),
      attack: totals.attack + (match.attack_mom_player_id === playerId ? 1 : 0),
    }),
    { defense: 0, midfield: 0, attack: 0 },
  );
}

function MetricCard({ label, value, tone = "text-slate-100", compact = false }: { label: string; value: string; tone?: string; compact?: boolean }) {
  return (
    <div className={`rounded-lg border border-slate-800 bg-slate-950 text-center ${compact ? "p-3" : "p-4"}`}>
      <div className="text-xs font-bold text-slate-500">{label}</div>
      <div className={`mt-1 font-black ${compact ? "text-lg" : "text-2xl"} ${tone}`}>{value}</div>
    </div>
  );
}

function TrendButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className={`rounded px-3 py-1.5 text-xs font-bold ${active ? "bg-accent-blue text-slate-950" : "text-slate-400 hover:text-slate-100"}`} onClick={onClick}>
      {children}
    </button>
  );
}

function Th({
  children,
  center = false,
  onClick,
  active = false,
  sticky,
}: {
  children: React.ReactNode;
  center?: boolean;
  onClick?: () => void;
  active?: boolean;
  sticky?: "rank" | "player";
}) {
  const stickyClass =
    sticky === "rank"
      ? "sticky left-0 z-20 w-[64px] bg-slate-950 px-3 xl:static xl:bg-transparent"
      : sticky === "player"
        ? "sticky left-[64px] z-20 w-[132px] bg-slate-950 px-3 xl:static xl:w-auto xl:bg-transparent xl:px-4"
        : "px-4";

  return (
    <th className={`whitespace-nowrap py-3 font-semibold ${stickyClass} ${center ? "text-center" : ""} ${active ? "text-accent-blue" : ""}`}>
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
