import Link from "next/link";
import { LineupBoard } from "@/components/lineup/LineupBoard";
import { LineupMatchCards } from "@/components/lineup/LineupMatchCards";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import { getAuthStatus } from "@/lib/authz";
import { calculateMatchResult, resultTone } from "@/lib/matches";
import type { Formation, Match, Period, PeriodLineup, Player, PositionSlot, Season } from "@/types";

type SearchParams = {
  matchId?: string;
};

type SquadRow = {
  players: Player;
};

type MatchRosterRow = {
  players: Player;
};

type FormationRow = Formation & {
  position_slots: PositionSlot[];
};

type ExistingLineupRow = PeriodLineup & {
  position_slots: PositionSlot;
  players: Player;
};

function sortLineupMatches(matches: Match[]) {
  return [...matches].sort((a, b) => {
    if (a.status !== b.status) return a.status === "scheduled" ? -1 : 1;
    const aTime = new Date(a.match_date).getTime();
    const bTime = new Date(b.match_date).getTime();
    return a.status === "scheduled" ? aTime - bTime : bTime - aTime;
  });
}

function selectDefaultMatch(matches: Match[], requestedMatchId?: string) {
  const requested = matches.find((match) => match.id === requestedMatchId);
  if (requested) return requested;

  const now = Date.now();
  const upcoming = matches
    .filter((match) => match.status === "scheduled" && new Date(match.match_date).getTime() >= now)
    .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime())[0];
  if (upcoming) return upcoming;

  const latestCompleted = matches
    .filter((match) => match.status === "completed")
    .sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime())[0];
  return latestCompleted ?? matches[0] ?? null;
}

function formatMatchDate(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function LineupPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { matchId } = await searchParams;
  const supabase = await createClient();
  const { canEdit, canManageMatchResults } = await getAuthStatus();

  const { data: activeSeason } = await supabase
    .from("seasons")
    .select("*")
    .eq("is_active", true)
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!activeSeason) {
    return (
      <div className="grid gap-6">
        <PageHeader title="라인업" description="활성 시즌의 경기 라인업을 준비합니다." />
        <Card className="grid gap-4">
          <div>
            <h2 className="text-lg font-semibold">활성 시즌이 없습니다</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">시즌 화면에서 현재 진행 중인 시즌을 활성화한 뒤 라인업을 준비하세요.</p>
          </div>
          <Link href="/seasons" className="w-fit">
            <Button type="button">시즌으로 이동</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const season = activeSeason as Season;
  const { data: matchRows = [] } = await supabase.from("matches").select("*").eq("season_id", season.id);
  const sortedMatches = sortLineupMatches((matchRows ?? []) as Match[]);
  const selectedMatch = selectDefaultMatch(sortedMatches, matchId);

  if (!selectedMatch) {
    return (
      <div className="grid gap-6">
        <PageHeader title="라인업" description={`${season.name} 경기 라인업을 준비합니다.`} />
        <Card className="grid gap-4">
          <div>
            <h2 className="text-lg font-semibold">등록된 경기가 없습니다</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">활성 시즌에 경기를 먼저 등록하면 이 화면에서 쿼터별 라인업을 준비할 수 있습니다.</p>
          </div>
          <Link href={`/seasons/${season.id}/matches`} className="w-fit">
            <Button type="button">경기 등록으로 이동</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const [{ data: periods = [] }, { data: squad = [] }, { data: matchRoster = [] }, { data: formations = [] }, { data: lineups = [] }] = await Promise.all([
    supabase.from("periods").select("*").eq("match_id", selectedMatch.id).order("order_num"),
    supabase.from("squad_members").select("players(*)").eq("season_id", season.id),
    supabase.from("match_roster").select("players(*)").eq("match_id", selectedMatch.id),
    supabase.from("formations").select("*, position_slots(*)").order("is_default", { ascending: false }).order("name"),
    supabase
      .from("period_lineups")
      .select("*, players(*), position_slots(*), periods!inner(match_id)")
      .eq("periods.match_id", selectedMatch.id),
  ]);

  const squadPlayers = ((squad ?? []) as unknown as SquadRow[])
    .map((row) => row.players)
    .filter(Boolean)
    .sort((a, b) => a.number - b.number);
  const matchRosterPlayers = ((matchRoster ?? []) as unknown as MatchRosterRow[])
    .map((row) => row.players)
    .filter(Boolean)
    .sort((a, b) => a.number - b.number);
  const selectedResult = calculateMatchResult(selectedMatch.our_score, selectedMatch.opponent_score);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageHeader title="라인업" description={`${season.name}의 경기 전 라인업을 쿼터별로 준비합니다.`} />
        <Link className="text-sm font-semibold text-accent-blue" href={`/seasons/${season.id}/matches`}>
          경기 관리
        </Link>
      </div>

      <section className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-100">경기 선택</h2>
          <span className="text-xs text-slate-400">{sortedMatches.length} matches</span>
        </div>
        <LineupMatchCards matches={sortedMatches} selectedMatchId={selectedMatch.id} />
      </section>

      <Card className="grid gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">vs {selectedMatch.opponent || "상대 미정"}</h2>
              <Badge tone={selectedMatch.status === "completed" ? "green" : "blue"}>
                {selectedMatch.status === "completed" ? "완료" : "예정"}
              </Badge>
              {selectedMatch.status === "completed" ? <Badge tone={resultTone(selectedResult)}>{selectedResult}</Badge> : null}
            </div>
            <p className="mt-2 text-sm text-slate-400">
              {formatMatchDate(selectedMatch.match_date)}
              {selectedMatch.venue ? ` · ${selectedMatch.venue}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold text-accent-blue">
            <Link href={`/seasons/${season.id}/matches/${selectedMatch.id}`}>경기 상세</Link>
            <Link href={`/seasons/${season.id}/matches/${selectedMatch.id}`}>{canManageMatchResults ? "결과 입력" : "결과 입력 권한 필요"}</Link>
            <Link href={`/seasons/${season.id}/matches/${selectedMatch.id}/stats`}>
              {canManageMatchResults ? "선수 기록" : "선수 기록 권한 필요"}
            </Link>
          </div>
        </div>
      </Card>

      <LineupBoard
        seasonId={season.id}
        matchId={selectedMatch.id}
        periods={periods as Period[]}
        formations={formations as unknown as FormationRow[]}
        squadPlayers={squadPlayers}
        matchRosterPlayers={matchRosterPlayers}
        existingLineups={lineups as unknown as ExistingLineupRow[]}
        canEdit={canEdit}
      />
    </div>
  );
}
