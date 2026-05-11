import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAuthStatus } from "@/lib/authz";
import { Card, PageHeader } from "@/components/ui/Card";
import { LineupBoard } from "@/components/lineup/LineupBoard";
import type { Formation, Match, Period, PeriodLineup, Player, PositionSlot } from "@/types";

type SquadRow = {
  players: Player;
};

type FormationRow = Formation & {
  position_slots: PositionSlot[];
};

type ExistingLineupRow = PeriodLineup & {
  position_slots: PositionSlot;
  players: Player;
};

export default async function LineupPage({
  params,
}: {
  params: Promise<{ id: string; matchId: string }>;
}) {
  const { id, matchId } = await params;
  const supabase = await createClient();
  const { canEdit } = await getAuthStatus();

  const [
    { data: match },
    { data: periods = [] },
    { data: squad = [] },
    { data: formations = [] },
  ] = await Promise.all([
    supabase.from("matches").select("*").eq("id", matchId).single(),
    supabase.from("periods").select("*").eq("match_id", matchId).order("order_num"),
    supabase.from("squad_members").select("players(*)").eq("season_id", id),
    supabase.from("formations").select("*, position_slots(*)").order("is_default", { ascending: false }).order("name"),
  ]);

  const periodIds = (periods ?? []).map((period) => period.id);
  const { data: existingLineups = [] } = periodIds.length
    ? await supabase
      .from("period_lineups")
      .select("*, players(*), position_slots(*)")
      .in("period_id", periodIds)
    : { data: [] };

  if (!match) {
    return <PageHeader title="Match not found" description="The selected match record does not exist." />;
  }

  const squadPlayers = (squad as unknown as SquadRow[])
    .map((row) => row.players)
    .filter(Boolean)
    .sort((a, b) => a.number - b.number);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageHeader
          title={`${(match as Match).opponent} lineup`}
          description="Drag squad players onto formation positions, then save the period lineup."
        />
        <Link className="text-sm font-semibold text-accent-blue" href={`/seasons/${id}/matches/${matchId}`}>
          Back to match
        </Link>
      </div>

      <Card>
        <LineupBoard
          seasonId={id}
          matchId={matchId}
          periods={periods as Period[]}
          formations={formations as unknown as FormationRow[]}
          squadPlayers={squadPlayers}
          existingLineups={existingLineups as unknown as ExistingLineupRow[]}
          canEdit={canEdit}
        />
      </Card>
    </div>
  );
}
