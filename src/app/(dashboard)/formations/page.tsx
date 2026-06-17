import { createFormationSubmit, deleteFormationSubmit } from "@/actions/formations";
import { createClient } from "@/lib/supabase/server";
import { getAuthStatus } from "@/lib/authz";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import type { Formation, PositionSlot } from "@/types";

type FormationRow = Formation & {
  position_slots: PositionSlot[];
};

export default async function FormationsPage() {
  const supabase = await createClient();
  const { canEdit } = await getAuthStatus();
  const { data: formations = [], error } = await supabase
    .from("formations")
    .select("*, position_slots(*)")
    .order("is_default", { ascending: false })
    .order("name");

  return (
    <div className="grid gap-6">
      <PageHeader
        title="포메이션"
        description="포메이션 템플릿은 쿼터별 라인업에서 사용할 포지션 위치를 정합니다."
      />

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        {canEdit ? (
        <Card>
          <h2 className="mb-4 text-lg font-semibold">커스텀 포메이션 생성</h2>
          <form action={createFormationSubmit} className="grid gap-3">
            <Input name="name" placeholder="포메이션 이름, 예: 4-2-3-1" required />
            <Textarea
              name="slots"
              defaultValue={"GK,50,90\nLB,15,70\nCB1,35,70\nCB2,65,70\nRB,85,70"}
            />
            <p className="text-xs leading-5 text-slate-400">
              한 줄에 하나씩 포지션 코드, x 좌표, y 좌표를 입력하세요. 좌표 범위는 0부터 100까지입니다.
            </p>
            <Button type="submit">포메이션 생성</Button>
          </form>
        </Card>
        ) : (
        <Card>
          <h2 className="mb-2 text-lg font-semibold">읽기 전용 접근</h2>
          <p className="text-sm leading-6 text-slate-400">
            포메이션을 생성하거나 삭제하려면 승인된 편집자 계정으로 로그인하세요.
          </p>
        </Card>
        )}

        <Card>
          <h2 className="mb-4 text-lg font-semibold">포메이션 목록</h2>
          {error ? <p className="text-sm text-accent-red">{error.message}</p> : null}
          <div className="grid gap-4">
            {(formations as unknown as FormationRow[]).map((formation) => (
              <div key={formation.id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{formation.name}</h3>
                    <p className="text-sm text-slate-400">포지션 {formation.position_slots.length}개</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {formation.is_default ? <Badge tone="blue">기본</Badge> : null}
                    {canEdit && !formation.is_default ? (
                      <form action={deleteFormationSubmit}>
                        <input type="hidden" name="id" value={formation.id} />
                        <Button type="submit" variant="danger" className="min-h-8 px-3 py-1">삭제</Button>
                      </form>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {formation.position_slots
                    .sort((a, b) => a.y - b.y || a.x - b.x)
                    .map((slot) => (
                      <span key={slot.id} className="rounded border border-slate-800 px-2 py-1 text-xs text-slate-300">
                        {slot.position_code} ({slot.x}, {slot.y})
                      </span>
                    ))}
                </div>
              </div>
            ))}
            {formations?.length === 0 ? <p className="text-sm text-slate-400">등록된 포메이션이 없습니다. Supabase 스키마 seed를 먼저 실행하세요.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
