import { Card, PageHeader } from "@/components/ui/Card";

export default function SchedulePage() {
  return (
    <section className="grid gap-6">
      <PageHeader title="경기 일정" description="다가올 일정과 이전 경기를 달력 형태로 볼 수 있게 준비 중입니다." />
      <Card className="grid gap-3">
        <h2 className="text-lg font-semibold text-slate-100">기능 추가 예정</h2>
        <p className="text-sm leading-6 text-slate-400">
          추후 FM 참고 레퍼런스를 기준으로 달력형 경기 일정 화면을 추가합니다. 현재는 메뉴 위치와 접근 흐름만 먼저 열어둔 상태입니다.
        </p>
      </Card>
    </section>
  );
}
