"use client";

import { useActionState } from "react";
import { savePlayerMatchStats } from "@/actions/stats";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ActionResult, Player, PlayerMatchStats } from "@/types";

const initialState: ActionResult = { ok: true, message: "" };

export function PlayerStatsForm({
  seasonId,
  matchId,
  player,
  stats,
  isAssigned,
  canEdit,
}: {
  seasonId: string;
  matchId: string;
  player: Player;
  stats: PlayerMatchStats | null;
  isAssigned: boolean;
  canEdit: boolean;
}) {
  const [state, formAction, pending] = useActionState(savePlayerMatchStats, initialState);
  const disabled = !canEdit || !isAssigned || pending;

  return (
    <form action={formAction} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
      <input type="hidden" name="season_id" value={seasonId} />
      <input type="hidden" name="match_id" value={matchId} />
      <input type="hidden" name="player_id" value={player.id} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-100">#{player.number} {player.name}</h3>
          <div className="mt-1 flex gap-2">
            {player.player_type === "guest" ? <Badge tone="blue">용병</Badge> : null}
            <Badge tone={isAssigned ? "green" : "default"}>{isAssigned ? "Lineup assigned" : "Not in lineup"}</Badge>
            {isAssigned && !stats ? <Badge tone="red">Not entered</Badge> : null}
            {stats ? <Badge tone="blue">Entered</Badge> : null}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input name="played" type="checkbox" defaultChecked={stats?.played ?? isAssigned} disabled={disabled} />
          Played
        </label>
      </div>

      <fieldset disabled={disabled} className="grid gap-3">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <label className="grid gap-1 text-xs text-slate-400">
            Goals
            <Input name="goals" type="number" min="0" defaultValue={stats?.goals ?? 0} />
          </label>
          <label className="grid gap-1 text-xs text-slate-400">
            Assists
            <Input name="assists" type="number" min="0" defaultValue={stats?.assists ?? 0} />
          </label>
          <label className="grid gap-1 text-xs text-slate-400">
            Yellow
            <Input name="yellow_cards" type="number" min="0" defaultValue={stats?.yellow_cards ?? 0} />
          </label>
          <label className="grid gap-1 text-xs text-slate-400">
            Red
            <Input name="red_cards" type="number" min="0" defaultValue={stats?.red_cards ?? 0} />
          </label>
        </div>
      </fieldset>

      {state.message ? <p className={`mt-3 text-sm ${state.ok ? "text-accent-green" : "text-accent-red"}`}>{state.message}</p> : null}
      {canEdit ? (
        <Button type="submit" disabled={disabled} className="mt-4">
          {pending ? "Saving..." : "Save stats"}
        </Button>
      ) : (
        <p className="mt-3 text-sm text-slate-400">Match result permission is required to update stats.</p>
      )}
    </form>
  );
}
