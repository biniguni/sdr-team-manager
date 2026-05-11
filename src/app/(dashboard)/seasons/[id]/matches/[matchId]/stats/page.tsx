import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAuthStatus } from "@/lib/authz";
import { Card, PageHeader } from "@/components/ui/Card";
import { PlayerStatsForm } from "@/components/stats/PlayerStatsForm";
import type { Match, Player, PlayerMatchStats } from "@/types";

type SquadRow = {
  players: Player;
};

export default async function MatchStatsPage({
  params,
}: {
  params: Promise<{ id: string; matchId: string }>;
}) {
  const { id, matchId } = await params;
  const supabase = await createClient();
  const { canEdit } = await getAuthStatus();

  const [{ data: match }, { data: squad = [] }, { data: assigned = [] }, { data: stats = [] }] =
    await Promise.all([
      supabase.from("matches").select("*").eq("id", matchId).single(),
      supabase.from("squad_members").select("players(*)").eq("season_id", id),
      supabase
        .from("period_lineups")
        .select("player_id, periods!inner(match_id)")
        .eq("periods.match_id", matchId),
      supabase.from("player_match_stats").select("*").eq("match_id", matchId),
    ]);

  if (!match) {
    return <PageHeader title="Match not found" description="The selected match record does not exist." />;
  }

  const squadPlayers = (squad as unknown as SquadRow[])
    .map((row) => row.players)
    .filter(Boolean)
    .sort((a, b) => a.number - b.number);
  const assignedPlayerIds = new Set((assigned ?? []).map((row) => row.player_id));
  const statsByPlayerId = new Map((stats as PlayerMatchStats[]).map((row) => [row.player_id, row]));

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageHeader
          title={`${(match as Match).opponent} stats`}
          description="Enter post-match player totals for lineup-assigned squad players."
        />
        <div className="flex gap-3 text-sm font-semibold text-accent-blue">
          <Link href={`/seasons/${id}/matches/${matchId}`}>Back to match</Link>
          <Link href={`/seasons/${id}/matches/${matchId}/lineup`}>Lineup</Link>
        </div>
      </div>

      <Card>
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Player records</h2>
          <p className="mt-1 text-sm text-slate-400">
            Players assigned in any period lineup can receive match stats. Unassigned squad players are shown for context.
          </p>
        </div>
        <div className="grid gap-4">
          {squadPlayers.map((player) => (
            <PlayerStatsForm
              key={player.id}
              seasonId={id}
              matchId={matchId}
              player={player}
              stats={statsByPlayerId.get(player.id) ?? null}
              isAssigned={assignedPlayerIds.has(player.id)}
              canEdit={canEdit}
            />
          ))}
          {squadPlayers.length === 0 ? <p className="text-sm text-slate-400">No squad players found for this season.</p> : null}
        </div>
      </Card>
    </div>
  );
}
