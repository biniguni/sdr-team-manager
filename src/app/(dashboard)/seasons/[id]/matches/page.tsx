import Link from "next/link";
import { createMatchSubmit } from "@/actions/matches";
import { createClient } from "@/lib/supabase/server";
import { getAuthStatus } from "@/lib/authz";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { calculateMatchResult, resultTone } from "@/lib/matches";
import type { Match, Season } from "@/types";

export default async function SeasonMatchesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { canEdit } = await getAuthStatus();
  const [{ data: season }, { data: matches = [], error }] = await Promise.all([
    supabase.from("seasons").select("*").eq("id", id).single(),
    supabase.from("matches").select("*").eq("season_id", id).order("match_date", { ascending: false }),
  ]);

  if (!season) return <PageHeader title="Season not found" />;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageHeader title={`${(season as Season).name} matches`} description="Create matches and define the periods used for lineups." />
        <Link className="text-sm font-semibold text-accent-blue" href={`/seasons/${id}`}>Back to season</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {canEdit ? (
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Create match</h2>
          <form action={createMatchSubmit} className="grid gap-3">
            <input type="hidden" name="season_id" value={id} />
            <Input name="opponent" placeholder="Opponent" required />
            <Input name="match_date" type="datetime-local" required />
            <Input name="venue" placeholder="Venue" />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input name="is_home" type="checkbox" defaultChecked />
              Home match
            </label>
            <label className="grid gap-1 text-sm text-slate-300">
              Period mode
              <Select name="period_mode" defaultValue="quarters">
                <option value="quarters">4쿼터: 1Q / 2Q / 3Q / 4Q</option>
                <option value="halves">전후반: 전반 / 후반</option>
              </Select>
            </label>
            <Textarea name="periods" placeholder="Optional custom periods, one per line" />
            <Button type="submit">Create match</Button>
          </form>
        </Card>
        ) : (
        <Card>
          <h2 className="mb-2 text-lg font-semibold">Read-only access</h2>
          <p className="text-sm leading-6 text-slate-400">
            Sign in with an approved editor account to create matches.
          </p>
        </Card>
        )}

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Match list</h2>
          {error ? <p className="text-sm text-accent-red">{error.message}</p> : null}
          <div className="grid gap-3">
            {(matches as Match[]).map((match) => {
              const result = calculateMatchResult(match.our_score, match.opponent_score);

              return (
                <Link
                  key={match.id}
                  href={`/seasons/${id}/matches/${match.id}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4 transition hover:border-accent-blue"
                >
                  <span>
                    <span className="block font-medium">{match.opponent}</span>
                    <span className="text-sm text-slate-400">
                      {new Date(match.match_date).toLocaleString()}
                      {match.our_score !== null && match.opponent_score !== null
                        ? ` / ${match.our_score}-${match.opponent_score}`
                        : ""}
                    </span>
                  </span>
                  <span className="flex flex-wrap justify-end gap-2">
                    <Badge tone={resultTone(result)}>{result}</Badge>
                    <Badge tone={match.status === "completed" ? "green" : "default"}>{match.status}</Badge>
                  </span>
                </Link>
              );
            })}
            {matches?.length === 0 ? <p className="text-sm text-slate-400">No matches found.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
