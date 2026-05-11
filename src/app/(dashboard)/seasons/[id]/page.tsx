import Link from "next/link";
import { addSquadMemberSubmit, removeSquadMemberSubmit, updateSeasonSubmit } from "@/actions/seasons";
import { createClient } from "@/lib/supabase/server";
import { getAuthStatus } from "@/lib/authz";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Player, Season } from "@/types";

type SquadRow = {
  player_id: string;
  players: Player;
};

export default async function SeasonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { canEdit } = await getAuthStatus();
  const [{ data: season }, { data: squad = [] }, { data: activePlayers = [] }] = await Promise.all([
    supabase.from("seasons").select("*").eq("id", id).single(),
    supabase
      .from("squad_members")
      .select("player_id, players(*)")
      .eq("season_id", id)
      .order("player_id"),
    supabase.from("players").select("*").eq("is_active", true).order("number"),
  ]);

  if (!season) {
    return <PageHeader title="Season not found" description="The selected season record does not exist." />;
  }

  const squadRows = squad as unknown as SquadRow[];
  const squadPlayerIds = new Set(squadRows.map((row) => row.player_id));
  const availablePlayers = (activePlayers as Player[]).filter((player) => !squadPlayerIds.has(player.id));

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageHeader title={(season as Season).name} description="Manage season details and the season squad." />
        <Link className="text-sm font-semibold text-accent-blue" href={`/seasons/${id}/matches`}>Open matches</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {canEdit ? (
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Season details</h2>
          <form action={updateSeasonSubmit} className="grid gap-3">
            <input type="hidden" name="id" value={id} />
            <Input name="name" defaultValue={(season as Season).name} required />
            <Input name="start_date" type="date" defaultValue={(season as Season).start_date} required />
            <Input name="end_date" type="date" defaultValue={(season as Season).end_date} required />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input name="is_active" type="checkbox" defaultChecked={(season as Season).is_active} />
              Active
            </label>
            <Button type="submit">Save season</Button>
          </form>
        </Card>
        ) : (
        <Card>
          <h2 className="mb-2 text-lg font-semibold">Season details</h2>
          <div className="grid gap-2 text-sm text-slate-300">
            <div>Name: {(season as Season).name}</div>
            <div>Period: {(season as Season).start_date} to {(season as Season).end_date}</div>
            <div>Status: {(season as Season).is_active ? "Active" : "Closed"}</div>
          </div>
        </Card>
        )}

        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Squad</h2>
            <Badge tone="blue">{squadRows.length} players</Badge>
          </div>
          {canEdit ? (
            <form action={addSquadMemberSubmit} className="mb-5 flex flex-col gap-3 sm:flex-row">
              <input type="hidden" name="season_id" value={id} />
              <Select name="player_id" required>
                <option value="">Choose active player</option>
                {availablePlayers.map((player) => (
                  <option key={player.id} value={player.id}>#{player.number} {player.name}</option>
                ))}
              </Select>
              <Button type="submit">Add</Button>
            </form>
          ) : null}
          <div className="grid gap-2">
            {squadRows
              .sort((a, b) => a.players.number - b.players.number)
              .map((row) => (
                <div key={row.player_id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <span className="text-sm">#{row.players.number} {row.players.name}</span>
                  {canEdit ? (
                    <form action={removeSquadMemberSubmit}>
                      <input type="hidden" name="season_id" value={id} />
                      <input type="hidden" name="player_id" value={row.player_id} />
                      <Button type="submit" variant="danger" className="min-h-8 px-3 py-1">Remove</Button>
                    </form>
                  ) : null}
                </div>
              ))}
            {squadRows.length === 0 ? <p className="text-sm text-slate-400">No squad players yet.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
