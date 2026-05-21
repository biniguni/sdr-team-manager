import Link from "next/link";
import { completeMatchSubmit, updateMatchSubmit } from "@/actions/matches";
import { createClient } from "@/lib/supabase/server";
import { getAuthStatus } from "@/lib/authz";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { calculateMatchResult, resultTone } from "@/lib/matches";
import type { Match, Period, Player } from "@/types";

type SquadRow = {
  players: Player;
};

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

function MomSelect({
  label,
  name,
  players,
  value,
  disabled = false,
}: {
  label: string;
  name: string;
  players: Player[];
  value: string | null;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-1 text-sm text-slate-300">
      {label}
      <Select name={name} defaultValue={value ?? ""} disabled={disabled}>
        <option value="">Not selected</option>
        {players.map((player) => (
          <option key={player.id} value={player.id}>
            #{player.number} {player.name}{player.player_type === "guest" ? " [용병]" : ""}
          </option>
        ))}
      </Select>
    </label>
  );
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string; matchId: string }>;
}) {
  const { id, matchId } = await params;
  const supabase = await createClient();
  const { canEdit, canManageMatchResults } = await getAuthStatus();
  const [{ data: match }, { data: periods = [] }, { data: squad = [] }] = await Promise.all([
    supabase.from("matches").select("*").eq("id", matchId).single(),
    supabase.from("periods").select("*").eq("match_id", matchId).order("order_num"),
    supabase
      .from("squad_members")
      .select("players(*)")
      .eq("season_id", id),
  ]);

  if (!match) return <PageHeader title="Match not found" />;

  const currentMatch = match as Match;
  const result = calculateMatchResult(currentMatch.our_score, currentMatch.opponent_score);
  const squadPlayers = (squad as unknown as SquadRow[])
    .map((row) => row.players)
    .filter(Boolean)
    .sort((a, b) => a.number - b.number);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageHeader title={currentMatch.opponent} description="Update match details, score, result, and MOM records." />
        <div className="flex gap-3 text-sm font-semibold text-accent-blue">
          <Link href={`/seasons/${id}/matches`}>Back</Link>
          <Link href={`/lineup?matchId=${matchId}`}>Lineup</Link>
          <Link href={`/seasons/${id}/matches/${matchId}/stats`}>Stats</Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[480px_1fr]">
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Match details</h2>
            <span className="flex gap-2">
              <Badge tone={resultTone(result)}>{result}</Badge>
              <Badge tone={currentMatch.status === "completed" ? "green" : "default"}>{currentMatch.status}</Badge>
            </span>
          </div>
          {canEdit ? (
            <>
              <form action={updateMatchSubmit} className="grid gap-3">
                <input type="hidden" name="id" value={matchId} />
                <input type="hidden" name="season_id" value={id} />
                <Input name="opponent" defaultValue={currentMatch.opponent} required />
                <Input name="match_date" type="datetime-local" defaultValue={toDateTimeLocal(currentMatch.match_date)} required />
                <Input name="venue" defaultValue={currentMatch.venue ?? ""} placeholder="Venue" />
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input name="is_home" type="checkbox" defaultChecked={currentMatch.is_home} />
                  Home match
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    name="our_score"
                    type="number"
                    min="0"
                    placeholder="Sandro score"
                    defaultValue={currentMatch.our_score ?? ""}
                    disabled={!canManageMatchResults}
                  />
                  <Input
                    name="opponent_score"
                    type="number"
                    min="0"
                    placeholder="Opponent score"
                    defaultValue={currentMatch.opponent_score ?? ""}
                    disabled={!canManageMatchResults}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <MomSelect label="Match MOM" name="match_mom_player_id" players={squadPlayers} value={currentMatch.match_mom_player_id} disabled={!canManageMatchResults} />
                  <MomSelect label="Defense MOM" name="defense_mom_player_id" players={squadPlayers} value={currentMatch.defense_mom_player_id} disabled={!canManageMatchResults} />
                  <MomSelect label="Midfield MOM" name="midfield_mom_player_id" players={squadPlayers} value={currentMatch.midfield_mom_player_id} disabled={!canManageMatchResults} />
                  <MomSelect label="Attack MOM" name="attack_mom_player_id" players={squadPlayers} value={currentMatch.attack_mom_player_id} disabled={!canManageMatchResults} />
                </div>
                <Select name="status" defaultValue={currentMatch.status} disabled={!canManageMatchResults}>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                </Select>
                {!canManageMatchResults ? (
                  <p className="text-sm text-slate-400">Match result permission is required to edit score, status, or MOM.</p>
                ) : null}
                <Button type="submit">Save match</Button>
              </form>
              {canManageMatchResults ? (
                <form action={completeMatchSubmit} className="mt-3">
                  <input type="hidden" name="id" value={matchId} />
                  <input type="hidden" name="season_id" value={id} />
                  <Button type="submit" variant="secondary">Complete with lineup check</Button>
                </form>
              ) : null}
            </>
          ) : (
            <div className="grid gap-2 text-sm text-slate-300">
              <div>Date: {new Date(currentMatch.match_date).toLocaleString()}</div>
              <div>Venue: {currentMatch.venue ?? "-"}</div>
              <div>Home/Away: {currentMatch.is_home ? "Home" : "Away"}</div>
              <div>Score: {currentMatch.our_score ?? "-"} - {currentMatch.opponent_score ?? "-"}</div>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Periods</h2>
          <div className="grid gap-2">
            {(periods as Period[]).map((period) => (
              <div key={period.id} className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm">
                {period.order_num}. {period.label}
              </div>
            ))}
            {periods?.length === 0 ? <p className="text-sm text-slate-400">No periods found.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
