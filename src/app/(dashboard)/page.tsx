import { MatchHistoryPanel } from "@/components/dashboard/MatchHistoryPanel";
import { SeasonFilter } from "@/components/dashboard/SeasonFilter";
import { SeasonSummaryCard } from "@/components/dashboard/SeasonSummaryCard";
import { StatCards } from "@/components/dashboard/StatCards";
import { TopScorersTable } from "@/components/dashboard/TopScorersTable";
import { aggregatePlayers, buildPlayersById, selectDefaultSeason, type PlayerStatsRow } from "@/lib/dashboard";
import { createClient } from "@/lib/supabase/server";
import type { Match, Player, Season } from "@/types";

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
        <h1 className="text-3xl font-extrabold">SANDRO FC 대시보드</h1>
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
  const { data: players = [] } = await supabase.from("players").select("*");

  const playerRows = aggregatePlayers(stats as unknown as PlayerStatsRow[]);
  const playersById = buildPlayersById((players ?? []) as Player[]);

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">SANDRO FC 시즌 현황</h1>
          <p className="mt-2 text-sm text-slate-500">{selectedSeason.name} 시즌 요약</p>
        </div>
        <SeasonFilter seasons={seasons as Season[]} selectedSeasonId={selectedSeason.id} />
      </div>

      <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)]">
        <div className="grid gap-4">
          <SeasonSummaryCard matches={matches as Match[]} />
          <StatCards players={playerRows} totalMatches={(matches as Match[]).length} />
          <TopScorersTable players={playerRows} limit={5} />
        </div>
        <MatchHistoryPanel matches={matches as Match[]} playersById={playersById} />
      </div>
    </section>
  );
}
