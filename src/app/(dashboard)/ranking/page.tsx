import { SeasonFilter } from "@/components/dashboard/SeasonFilter";
import { TopScorersTable } from "@/components/dashboard/TopScorersTable";
import { aggregatePlayers, selectDefaultSeason, type PlayerStatsRow } from "@/lib/dashboard";
import { createClient } from "@/lib/supabase/server";
import type { Match, Season } from "@/types";

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
    .select("id")
    .eq("season_id", selectedSeason.id);
  const matchIds = (matches as Pick<Match, "id">[]).map((match) => match.id);
  const { data: stats = [] } = matchIds.length
    ? await supabase.from("player_match_stats").select("*, players(*)").in("match_id", matchIds)
    : { data: [] };
  const playerRows = aggregatePlayers(stats as unknown as PlayerStatsRow[]);

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">공격포인트 순위</h1>
          <p className="mt-2 text-sm text-slate-500">{selectedSeason.name}의 득점, 도움, 공격포인트를 확인합니다.</p>
        </div>
        <SeasonFilter seasons={seasons as Season[]} selectedSeasonId={selectedSeason.id} />
      </div>
      <TopScorersTable players={playerRows} />
    </section>
  );
}
