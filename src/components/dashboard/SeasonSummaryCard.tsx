import { calculateMatchResult } from "@/lib/matches";
import type { Match } from "@/types";

export function SeasonSummaryCard({ matches }: { matches: Match[] }) {
  const completed = matches.filter((match) => match.our_score !== null && match.opponent_score !== null);
  const wins = completed.filter((match) => calculateMatchResult(match.our_score, match.opponent_score) === "Win").length;
  const draws = completed.filter((match) => calculateMatchResult(match.our_score, match.opponent_score) === "Draw").length;
  const losses = completed.filter((match) => calculateMatchResult(match.our_score, match.opponent_score) === "Loss").length;
  const goalsFor = completed.reduce((sum, match) => sum + (match.our_score ?? 0), 0);
  const goalsAgainst = completed.reduce((sum, match) => sum + (match.opponent_score ?? 0), 0);
  const goalDiff = goalsFor - goalsAgainst;
  const winRate = completed.length ? Math.round((wins / completed.length) * 1000) / 10 : 0;
  const recent = [...completed]
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime())
    .slice(-8);

  return (
    <section className="rounded-lg border border-slate-800 bg-bg-secondary/80 p-5">
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex gap-5">
          <RecordNumber label="W" value={wins} tone="text-accent-blue" />
          <RecordNumber label="D" value={draws} tone="text-slate-300" />
          <RecordNumber label="L" value={losses} tone="text-accent-red" />
        </div>
        <div className="hidden h-16 w-px bg-slate-800 sm:block" />
        <div className="grid flex-1 grid-cols-3 gap-4 text-center">
          <SmallStat label="승률" value={`${winRate}%`} tone="text-accent-green" />
          <SmallStat label="득실" value={`${goalsFor}:${goalsAgainst}`} />
          <SmallStat label="득실차" value={goalDiff >= 0 ? `+${goalDiff}` : `${goalDiff}`} tone={goalDiff >= 0 ? "text-accent-green" : "text-accent-red"} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4">
        <span className="mr-1 text-xs font-medium text-slate-500">최근 경기</span>
        {recent.map((match) => {
          const result = calculateMatchResult(match.our_score, match.opponent_score);
          const className =
            result === "Win"
              ? "border-sky-400/40 bg-sky-400/15 text-accent-blue"
              : result === "Loss"
                ? "border-red-400/30 bg-red-400/10 text-accent-red"
                : "border-slate-500/30 bg-slate-500/10 text-slate-300";

          return (
            <span key={match.id} className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${className}`}>
              {result[0]}
            </span>
          );
        })}
        {recent.length === 0 ? <span className="text-sm text-slate-500">점수가 입력된 경기가 없습니다.</span> : null}
      </div>
    </section>
  );
}

function RecordNumber({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-black ${tone}`}>{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}

function SmallStat({ label, value, tone = "text-slate-100" }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <div className={`text-xl font-extrabold ${tone}`}>{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}
