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
        title="선수"
        description="선수를 한 번 등록하면 시즌 스쿼드, 라인업, 경기 기록에서 계속 사용할 수 있습니다."
      />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {canEdit ? (
        <Card>
          <h2 className="mb-4 text-lg font-semibold">선수 추가</h2>
          <PlayerForm action={createPlayerForm} submitLabel="선수 추가" />
        </Card>
        ) : (
        <Card>
          <h2 className="mb-2 text-lg font-semibold">읽기 전용 접근</h2>
          <p className="text-sm leading-6 text-slate-400">
            선수를 추가하거나 수정하려면 승인된 편집자 계정으로 로그인하세요.
          </p>
        </Card>
        )}

        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">선수 목록</h2>
            <div className="flex gap-2 text-sm">
              <a className="text-accent-blue" href="/players?status=active">활성</a>
              <a className="text-slate-300" href="/players?status=all">전체</a>
              <a className="text-slate-300" href="/players?status=inactive">비활성</a>
            </div>
          </div>
          {error ? <p className="text-sm text-accent-red">{error.message}</p> : null}
          <div className="grid gap-3">
            {(players as Player[]).map((player) => (
              <details key={player.id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <summary className="flex cursor-pointer items-center justify-between gap-3">
                  <span className="flex min-w-0 flex-wrap items-center gap-2 font-medium">
                    <span>{player.name}</span>
                    <span className="rounded bg-slate-900 px-1.5 py-0.5 text-xs font-semibold text-slate-400">L{player.left_foot_score}</span>
                    <span className="rounded bg-slate-900 px-1.5 py-0.5 text-xs font-semibold text-slate-400">R{player.right_foot_score}</span>
                    <span className="text-slate-500">#{player.number}</span>
                  </span>
                  <span className="flex gap-2">
                    {player.player_type === "guest" ? <Badge tone="blue">용병</Badge> : null}
                    <Badge tone={player.is_active ? "green" : "red"}>{player.is_active ? "활성" : "비활성"}</Badge>
                  </span>
                </summary>
                {canEdit ? (
                  <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
                    <PlayerForm player={player} action={updatePlayerForm} submitLabel="변경사항 저장" />
                    {player.is_active ? (
                      <form action={deactivatePlayerSubmit} className="self-end">
                        <input type="hidden" name="id" value={player.id} />
                        <Button type="submit" variant="danger">비활성화</Button>
                      </form>
                    ) : null}
                  </div>
                ) : (
                  <dl className="mt-4 grid gap-2 text-sm text-slate-300">
                    <div>구분: {player.player_type === "guest" ? "용병" : "정규 선수"}</div>
                    <div>상태: {player.is_active ? "활성" : "비활성"}</div>
                  </dl>
                )}
              </details>
            ))}
            {players?.length === 0 ? <p className="text-sm text-slate-400">조건에 맞는 선수가 없습니다.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
