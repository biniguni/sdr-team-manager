import type { Player } from "@/types";

export type PlayerAggregate = {
  player: Player;
  goals: number;
  assists: number;
  match_count: number;
  points: number;
  mom_count: number;
};

export function StatCards({ players, totalMatches }: { players: PlayerAggregate[]; totalMatches: number }) {
  const topScorer = maxBy(players, "goals");
  const topAssister = maxBy(players, "assists");
  const topPoints = maxBy(players, "points");
  const topAppearances = maxBy(players, "match_count");

  const cards = [
    { label: "득점 1위", value: topScorer?.player.name ?? "-", sub: topScorer ? `${topScorer.goals}골` : "", tone: "text-accent-blue" },
    { label: "도움 1위", value: topAssister?.player.name ?? "-", sub: topAssister ? `${topAssister.assists}도움` : "", tone: "text-accent-orange" },
    { label: "공격포인트 1위", value: topPoints?.player.name ?? "-", sub: topPoints ? `${topPoints.goals}골 + ${topPoints.assists}도움 = ${topPoints.points}P` : "", tone: "text-accent-purple" },
    { label: "최다 출전", value: topAppearances?.player.name ?? "-", sub: topAppearances ? `${topAppearances.match_count} / ${totalMatches}경기` : "", tone: "text-accent-green" },
  ];

  return (
    <section className="grid grid-cols-2 gap-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-slate-800 bg-bg-secondary/80 p-4">
          <div className="text-xs font-medium text-slate-500">{card.label}</div>
          <div className={`mt-2 truncate text-lg font-extrabold ${card.tone}`}>{card.value}</div>
          <div className="mt-1 truncate text-xs text-slate-500">{card.sub || "데이터가 없습니다."}</div>
        </div>
      ))}
    </section>
  );
}

function maxBy(players: PlayerAggregate[], key: "goals" | "assists" | "match_count" | "points") {
  return [...players].sort((a, b) => b[key] - a[key])[0];
}
