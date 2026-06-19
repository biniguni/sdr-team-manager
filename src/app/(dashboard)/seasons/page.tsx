import Link from "next/link";
import { createSeasonSubmit } from "@/actions/seasons";
import { createClient } from "@/lib/supabase/server";
import { getAuthStatus } from "@/lib/authz";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { Season } from "@/types";

export default async function SeasonsPage() {
  const supabase = await createClient();
  const { canEdit } = await getAuthStatus();
  const { data: seasons = [], error } = await supabase
    .from("seasons")
    .select("*")
    .order("start_date", { ascending: false });

  return (
    <div className="grid gap-6">
      <PageHeader title="시즌 관리" description="특정 기간의 스쿼드와 경기를 함께 관리합니다." />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {canEdit ? (
        <Card>
          <h2 className="mb-4 text-lg font-semibold">시즌 생성</h2>
          <form action={createSeasonSubmit} className="grid gap-3">
            <Input name="name" placeholder="시즌명" required />
            <Input name="start_date" type="date" required />
            <Input name="end_date" type="date" required />
            <Button type="submit">시즌 생성</Button>
          </form>
        </Card>
        ) : (
        <Card>
          <h2 className="mb-2 text-lg font-semibold">편집 권한 필요</h2>
          <p className="text-sm leading-6 text-slate-400">
            시즌을 생성하려면 승인된 계정으로 로그인하세요.
          </p>
        </Card>
        )}

        <Card>
          <h2 className="mb-4 text-lg font-semibold">시즌 목록</h2>
          {error ? <p className="text-sm text-accent-red">{error.message}</p> : null}
          <div className="grid gap-3">
            {(seasons as Season[]).map((season) => (
              <Link
                key={season.id}
                href={`/seasons/${season.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4 transition hover:border-accent-blue"
              >
                <span>
                  <span className="block font-medium">{season.name}</span>
                  <span className="text-sm text-slate-400">{season.start_date} ~ {season.end_date}</span>
                </span>
                <Badge tone={season.is_active ? "green" : "default"}>{season.is_active ? "Active" : "Closed"}</Badge>
              </Link>
            ))}
            {seasons?.length === 0 ? <p className="text-sm text-slate-400">등록된 시즌이 없습니다.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
