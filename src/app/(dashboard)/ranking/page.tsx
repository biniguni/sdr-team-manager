import { SeasonFilter } from "@/components/dashboard/SeasonFilter";
import { RankingView } from "@/components/ranking/RankingView";
import { aggregatePlayers, selectDefaultSeason, type PlayerStatsRow } from "@/lib/dashboard";
import { createClient } from "@/lib/supabase/server";
import type { Match, Player, PositionPerformance, Season } from "@/types";

type SquadPlayerRow = {
  players: Player;
};

export default async function RankingPage({
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
    return <p className="text-sm text-slate-400">개인 기록 순위를 보려면 시즌을 먼저 생성하세요.</p>;
  }

  const { data: matches = [] } = await supabase
    .from("matches")
    .select("*")
    .eq("season_id", selectedSeason.id)
    .order("match_date", { ascending: true });
  const matchIds = (matches as Match[]).map((match) => match.id);
  const [{ data: stats = [] }, { data: squad = [] }, { data: positionRows = [] }] = await Promise.all([
    matchIds.length
      ? supabase.from("player_match_stats").select("*, players(*)").in("match_id", matchIds)
      : Promise.resolve({ data: [] }),
    supabase.from("squad_members").select("players(*)").eq("season_id", selectedSeason.id),
    supabase.from("position_performance").select("player_id, position_code, period_count, match_count, goals, assists").eq("season_id", selectedSeason.id),
  ]);
  const squadPlayers = ((squad ?? []) as unknown as SquadPlayerRow[])
    .map((row) => row.players)
    .filter(Boolean)
    .filter((player) => player.player_type === "member");
  const playerRows = aggregatePlayers(stats as unknown as PlayerStatsRow[], matches as Match[], squadPlayers);

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">개인 기록 순위</h1>
          <p className="mt-2 text-sm text-slate-500">{selectedSeason.name}의 출전, 득점, 도움, 무실점, MOM을 확인합니다.</p>
        </div>
        <SeasonFilter seasons={seasons as Season[]} selectedSeasonId={selectedSeason.id} />
      </div>
      <RankingView
        players={playerRows}
        matches={matches as Match[]}
        stats={stats as unknown as PlayerStatsRow[]}
        positionRows={positionRows as Pick<PositionPerformance, "player_id" | "position_code" | "period_count" | "match_count" | "goals" | "assists">[]}
      />
    </section>
  );
}
