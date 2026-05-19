import { createClient } from "@/lib/supabase/server";
import { getAuthStatus } from "@/lib/authz";
import { createPlayerForm, deactivatePlayerSubmit, updatePlayerForm } from "@/actions/players";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { PlayerForm } from "@/components/players/PlayerForm";
import type { Player } from "@/types";

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "active" } = await searchParams;
  const supabase = await createClient();
  const { canEdit } = await getAuthStatus();
  let query = supabase.from("players").select("*").order("name").order("number");

  if (status === "active") query = query.eq("is_active", true);
  if (status === "inactive") query = query.eq("is_active", false);

  const { data: players = [], error } = await query;

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Players"
        description="Register players once, then reuse them across seasons, squads, lineups, and match records."
      />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {canEdit ? (
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Add player</h2>
          <PlayerForm action={createPlayerForm} submitLabel="Add player" />
        </Card>
        ) : (
        <Card>
          <h2 className="mb-2 text-lg font-semibold">Read-only access</h2>
          <p className="text-sm leading-6 text-slate-400">
            Sign in with an approved editor account to add or update players.
          </p>
        </Card>
        )}

        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Player list</h2>
            <div className="flex gap-2 text-sm">
              <a className="text-accent-blue" href="/players?status=active">Active</a>
              <a className="text-slate-300" href="/players?status=all">All</a>
              <a className="text-slate-300" href="/players?status=inactive">Inactive</a>
            </div>
          </div>
          {error ? <p className="text-sm text-accent-red">{error.message}</p> : null}
          <div className="grid gap-3">
            {(players as Player[]).map((player) => (
              <details key={player.id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <summary className="flex cursor-pointer items-center justify-between gap-3">
                  <span className="font-medium">{player.name} <span className="text-slate-500">#{player.number}</span></span>
                  <span className="flex gap-2">
                    {player.player_type === "guest" ? <Badge tone="blue">용병</Badge> : null}
                    <Badge tone={player.is_active ? "green" : "red"}>{player.is_active ? "Active" : "Inactive"}</Badge>
                  </span>
                </summary>
                {canEdit ? (
                  <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
                    <PlayerForm player={player} action={updatePlayerForm} submitLabel="Save changes" />
                    {player.is_active ? (
                      <form action={deactivatePlayerSubmit} className="self-end">
                        <input type="hidden" name="id" value={player.id} />
                        <Button type="submit" variant="danger">Deactivate</Button>
                      </form>
                    ) : null}
                  </div>
                ) : (
                  <dl className="mt-4 grid gap-2 text-sm text-slate-300">
                    <div>Type: {player.player_type === "guest" ? "Guest" : "Member"}</div>
                    <div>Status: {player.is_active ? "Active" : "Inactive"}</div>
                  </dl>
                )}
              </details>
            ))}
            {players?.length === 0 ? <p className="text-sm text-slate-400">No players found.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
