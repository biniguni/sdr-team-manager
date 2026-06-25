import Link from "next/link";
import { completeMatchSubmit, updateMatchSubmit } from "@/actions/matches";
import { createClient } from "@/lib/supabase/server";
import { getAuthStatus } from "@/lib/authz";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { calculateMatchResult, formatMatchResult, resultTone } from "@/lib/matches";
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
        <option value="">선택 안 함</option>
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
    .filter((player) => player.player_type === "member")
    .sort((a, b) => a.number - b.number);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <PageHeader title={currentMatch.opponent} description="경기 정보, 점수, 결과, MOM 관리" />
        <div className="flex gap-3 text-sm font-semibold text-accent-blue">
          <Link href={`/seasons/${id}/matches`}>뒤로</Link>
          <Link href={`/lineup?matchId=${matchId}`}>라인업</Link>
          <Link href={`/seasons/${id}/matches/${matchId}/stats`}>선수 기록</Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[480px_1fr]">
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">경기 상세</h2>
            <span className="flex gap-2">
              <Badge tone={resultTone(result)}>{formatMatchResult(result)}</Badge>
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
                <Input name="venue" defaultValue={currentMatch.venue ?? ""} placeholder="경기장" />
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input name="is_home" type="checkbox" defaultChecked={currentMatch.is_home} />
                  홈 경기
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    name="our_score"
                    type="number"
                    min="0"
                    placeholder="산드로 점수"
                    defaultValue={currentMatch.our_score ?? ""}
                    disabled={!canManageMatchResults}
                  />
                  <Input
                    name="opponent_score"
                    type="number"
                    min="0"
                    placeholder="상대 점수"
                    defaultValue={currentMatch.opponent_score ?? ""}
                    disabled={!canManageMatchResults}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <MomSelect label="경기 MOM" name="match_mom_player_id" players={squadPlayers} value={currentMatch.match_mom_player_id} disabled={!canManageMatchResults} />
                  <MomSelect label="수비 MOM" name="defense_mom_player_id" players={squadPlayers} value={currentMatch.defense_mom_player_id} disabled={!canManageMatchResults} />
                  <MomSelect label="미드필드 MOM" name="midfield_mom_player_id" players={squadPlayers} value={currentMatch.midfield_mom_player_id} disabled={!canManageMatchResults} />
                  <MomSelect label="공격 MOM" name="attack_mom_player_id" players={squadPlayers} value={currentMatch.attack_mom_player_id} disabled={!canManageMatchResults} />
                </div>
                <Select name="status" defaultValue={currentMatch.status} disabled={!canManageMatchResults}>
                  <option value="scheduled">다가올 경기</option>
                  <option value="completed">종료</option>
                </Select>
                {!canManageMatchResults ? (
                  <p className="text-sm text-slate-400">점수, 경기 상태, MOM을 수정하기 위해서는 관리 권한이 필요합니다.</p>
                ) : null}
                <Button type="submit">매치 저장</Button>
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
              <div>일시: {new Date(currentMatch.match_date).toLocaleString()}</div>
              <div>경기장: {currentMatch.venue ?? "-"}</div>
              <div>홈/원정: {currentMatch.is_home ? "홈" : "원정"}</div>
              <div>점수: {currentMatch.our_score ?? "-"} - {currentMatch.opponent_score ?? "-"}</div>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">쿼터</h2>
          <div className="grid gap-2">
            {(periods as Period[]).map((period) => (
              <div key={period.id} className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm">
                {period.order_num}. {period.label}
              </div>
            ))}
            {periods?.length === 0 ? <p className="text-sm text-slate-400">등록된 쿼터가 없습니다.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
