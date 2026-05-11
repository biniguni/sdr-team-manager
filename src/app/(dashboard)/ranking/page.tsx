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
    return <p className="text-sm text-slate-400">Create a season first to view rankings.</p>;
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
          <h1 className="text-3xl font-extrabold tracking-tight">Attack Ranking</h1>
          <p className="mt-2 text-sm text-slate-500">Goals, assists, and attacking points for {selectedSeason.name}</p>
        </div>
        <SeasonFilter seasons={seasons as Season[]} selectedSeasonId={selectedSeason.id} />
      </div>
      <TopScorersTable players={playerRows} />
    </section>
  );
}
