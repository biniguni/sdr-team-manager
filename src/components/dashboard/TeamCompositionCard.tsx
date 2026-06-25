export function TeamCompositionCard({
  totalSquadPlayers,
  activeSquadPlayers,
  averageAttendance,
}: {
  totalSquadPlayers: number;
  activeSquadPlayers: number;
  averageAttendance: number;
}) {
  return (
    <section className="rounded-lg border border-slate-800 bg-bg-secondary/80 p-5">
      <h2 className="text-sm font-bold text-slate-100">팀 구성</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
          <div className="text-xs font-medium text-slate-500">활동 인원</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-2xl font-black text-accent-blue">{activeSquadPlayers}</span>
            <span className="pb-1 text-xs font-semibold text-slate-500">/ 총 {totalSquadPlayers}</span>
          </div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
          <div className="text-xs font-medium text-slate-500">경기당 평균참석</div>
          <div className="mt-2 text-2xl font-black text-accent-green">{averageAttendance.toFixed(1)}</div>
        </div>
      </div>
    </section>
  );
}
