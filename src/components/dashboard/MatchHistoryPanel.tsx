import { Badge } from "@/components/ui/Badge";
import { calculateMatchResult, resultTone } from "@/lib/matches";
import type { Match, Player } from "@/types";

export function MatchHistoryPanel({ matches, playersById }: { matches: Match[]; playersById: Map<string, Player> }) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-slate-800 bg-bg-secondary/80 xl:max-h-[var(--dashboard-left-height)]">
      <div className="border-b border-slate-800 px-5 py-4 text-sm font-bold">경기 기록</div>
      <div className="grid min-h-0 max-h-[640px] flex-1 gap-3 overflow-y-auto p-3 xl:max-h-none">
        {matches.map((match) => {
          const result = calculateMatchResult(match.our_score, match.opponent_score);

          return (
            <article key={match.id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-500">
                  {new Date(match.match_date).toLocaleDateString()} {match.venue ? `/ ${match.venue}` : ""}
                </span>
                <Badge tone={resultTone(result)}>{result}</Badge>
              </div>
              <div className="mt-3 flex items-center justify-center gap-4">
                <div className="flex-1 text-right text-sm font-bold">
                  SANDRO
                  <span className="block text-[10px] font-medium text-slate-500">{match.is_home ? "홈" : "원정"}</span>
                </div>
                <div className="min-w-24 rounded-md border border-slate-800 bg-bg-primary px-3 py-1 text-center text-2xl font-black">
                  {match.our_score ?? "-"} - {match.opponent_score ?? "-"}
                </div>
                <div className="flex-1 text-sm font-bold text-slate-300">{match.opponent}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-800 pt-3">
                <Mom label="MVP" value={playersById.get(match.match_mom_player_id ?? "")?.name} highlight />
                <Mom label="DEF" value={playersById.get(match.defense_mom_player_id ?? "")?.name} />
                <Mom label="MID" value={playersById.get(match.midfield_mom_player_id ?? "")?.name} />
                <Mom label="FWD" value={playersById.get(match.attack_mom_player_id ?? "")?.name} />
              </div>
            </article>
          );
        })}
        {matches.length === 0 ? <p className="p-3 text-sm text-slate-500">등록된 경기가 없습니다.</p> : null}
      </div>
    </section>
  );
}

function Mom({ label, value, highlight = false }: { label: string; value?: string; highlight?: boolean }) {
  return (
    <span className={`rounded-md border px-2 py-1 text-xs ${highlight ? "border-yellow-400/20 bg-yellow-400/10 text-accent-yellow" : "border-slate-800 bg-slate-900 text-slate-400"}`}>
      {label} <strong className={highlight ? "text-accent-yellow" : "text-accent-blue"}>{value ?? "-"}</strong>
    </span>
  );
}
