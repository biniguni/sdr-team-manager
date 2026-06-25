import { MatchHistoryPanel } from "@/components/dashboard/MatchHistoryPanel";
import { SeasonFilter } from "@/components/dashboard/SeasonFilter";
import { SeasonSummaryCard } from "@/components/dashboard/SeasonSummaryCard";
import { StatCards } from "@/components/dashboard/StatCards";
import { TeamCompositionCard } from "@/components/dashboard/TeamCompositionCard";
import { TopScorersTable } from "@/components/dashboard/TopScorersTable";
import { aggregatePlayers, buildPlayersById, selectDefaultSeason, type PlayerStatsRow } from "@/lib/dashboard";
import { createClient } from "@/lib/supabase/server";
import type { Match, Player, Season } from "@/types";

type SquadPlayerRow = {
  players: Player;
};

type LineupAttendanceRow = {
  player_id: string;
  periods: {
    match_id: string;
  };
};

export default async function DashboardHome({
  searchParams,
}: {
  searchParams: Promise<{ seasonId?: string }>;
}) {
  const { seasonId } = await searchParams;
  const supabase = await createClient();
  const { data: seasons = [] } = await supabase
    .from("seasons")
    .select("*")
    .order("start_date", { ascending: false });
  const selectedSeason = selectDefaultSeason(seasons as Season[], seasonId);

  if (!selectedSeason) {
    return (
      <section className="grid gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">SANDRO FC 대시보드</h1>
        <p className="text-sm text-slate-400">대시보드를 보려면 시즌을 먼저 생성하세요.</p>
      </section>
    );
  }

  const { data: matches = [] } = await supabase
    .from("matches")
    .select("*")
    .eq("season_id", selectedSeason.id)
    .order("match_date", { ascending: false });
  const matchIds = (matches as Match[]).map((match) => match.id);
  const { data: stats = [] } = matchIds.length
    ? await supabase.from("player_match_stats").select("*, players(*)").in("match_id", matchIds)
    : { data: [] };
  const { data: players = [] } = await supabase.from("players").select("*").eq("player_type", "member");
  const [{ data: squad = [] }, { data: lineupAttendance = [] }] = await Promise.all([
    supabase.from("squad_members").select("players(*)").eq("season_id", selectedSeason.id),
    supabase
      .from("period_lineups")
      .select("player_id, periods!inner(match_id)")
      .in("periods.match_id", matchIds.length ? matchIds : ["00000000-0000-0000-0000-000000000000"]),
  ]);

  const playerRows = aggregatePlayers(stats as unknown as PlayerStatsRow[]);
  const playersById = buildPlayersById((players ?? []) as Player[]);
  const squadPlayers = ((squad ?? []) as unknown as SquadPlayerRow[])
    .map((row) => row.players)
    .filter(Boolean)
    .filter((player) => player.player_type === "member");
  const activeSquadPlayers = squadPlayers.filter((player) => player.is_active).length;
  const attendanceByMatch = new Map<string, Set<string>>();
  for (const row of (lineupAttendance ?? []) as unknown as LineupAttendanceRow[]) {
    const matchIdForRow = row.periods.match_id;
    const attendance = attendanceByMatch.get(matchIdForRow) ?? new Set<string>();
    attendance.add(row.player_id);
    attendanceByMatch.set(matchIdForRow, attendance);
  }
  const attendanceTotal = [...attendanceByMatch.values()].reduce((sum, attendance) => sum + attendance.size, 0);
  const averageAttendance = attendanceByMatch.size ? attendanceTotal / attendanceByMatch.size : 0;

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">SANDRO FC 시즌 현황</h1>
          <p className="mt-2 text-sm text-slate-500">{selectedSeason.name} 시즌 요약</p>
        </div>
        <SeasonFilter seasons={seasons as Season[]} selectedSeasonId={selectedSeason.id} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)]">
        <div className="grid gap-4">
          <SeasonSummaryCard matches={matches as Match[]} />
          <MatchHistoryPanel matches={matches as Match[]} playersById={playersById} />
        </div>
        <div className="grid content-start gap-4">
          <TeamCompositionCard
            totalSquadPlayers={squadPlayers.length}
            activeSquadPlayers={activeSquadPlayers}
            averageAttendance={averageAttendance}
          />
          <StatCards players={playerRows} totalMatches={(matches as Match[]).length} />
          <TopScorersTable players={playerRows} limit={5} />
        </div>
      </div>
    </section>
  );
}
