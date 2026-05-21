"use client";

import { DndContext, DragEndEvent, DragOverlay, PointerSensor, TouchSensor, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useState } from "react";
import { createGuestPlayerForLineup, saveLineup } from "@/actions/lineups";
import { PlayerDraggable } from "@/components/lineup/PlayerDraggable";
import { PositionSlotDroppable } from "@/components/lineup/PositionSlotDroppable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { ActionResult, Formation, Period, PeriodLineup, Player, PositionSlot } from "@/types";

type FormationWithSlots = Formation & {
  position_slots: PositionSlot[];
};

type ExistingLineup = PeriodLineup & {
  position_slots: PositionSlot;
  players: Player;
};

const initialState: ActionResult = { ok: true, message: "" };
const EMPTY_PLAYER_VALUE = "__empty__";

function BenchDroppable({ children }: { children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id: "bench" });

  return (
    <div
      ref={setNodeRef}
      className={`grid min-h-40 gap-2 rounded-lg border p-3 transition ${
        isOver ? "border-accent-blue bg-sky-950/40" : "border-slate-800 bg-slate-950"
      }`}
    >
      {children}
    </div>
  );
}

export function LineupBoard({
  seasonId,
  matchId,
  periods,
  formations,
  squadPlayers,
  existingLineups,
  canEdit,
}: {
  seasonId: string;
  matchId: string;
  periods: Period[];
  formations: FormationWithSlots[];
  squadPlayers: Player[];
  existingLineups: ExistingLineup[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );
  const [selectedPeriodId, setSelectedPeriodId] = useState(periods[0]?.id ?? "");
  const periodLineup = existingLineups.filter((entry) => entry.period_id === selectedPeriodId);
  const initialFormationId = periodLineup[0]?.formation_id ?? formations[0]?.id ?? "";
  const [selectedFormationId, setSelectedFormationId] = useState(initialFormationId);
  const [assignments, setAssignments] = useState<Record<string, string>>(() =>
    Object.fromEntries(periodLineup.map((entry) => [entry.position_slot_id, entry.player_id])),
  );
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [state, formAction, pending] = useActionState(saveLineup, initialState);
  const [guestState, guestFormAction, guestPending] = useActionState(createGuestPlayerForLineup, initialState);

  useEffect(() => {
    if (!state.ok || !state.message) return;
    router.refresh();
  }, [state.ok, state.message, router]);

  useEffect(() => {
    if (!guestState.ok || !guestState.message) return;
    router.refresh();
  }, [guestState.ok, guestState.message, router]);

  useEffect(() => {
    (window as unknown as { lineupHasUnsavedChanges?: boolean }).lineupHasUnsavedChanges = isDirty;
    return () => {
      (window as unknown as { lineupHasUnsavedChanges?: boolean }).lineupHasUnsavedChanges = false;
    };
  }, [isDirty]);

  const selectedFormation = formations.find((formation) => formation.id === selectedFormationId);
  const slots = useMemo(() => selectedFormation?.position_slots ?? [], [selectedFormation]);
  const orderedSlots = useMemo(() => [...slots].sort((a, b) => b.y - a.y || a.x - b.x), [slots]);
  const playersById = useMemo(() => new Map(squadPlayers.map((player) => [player.id, player])), [squadPlayers]);
  const assignedPlayerIds = new Set(Object.values(assignments).filter(Boolean));
  const unassignedPlayers = squadPlayers.filter((player) => !assignedPlayerIds.has(player.id));
  const selectedPeriod = periods.find((period) => period.id === selectedPeriodId);

  function lineupForPeriod(periodId: string) {
    return existingLineups.filter((entry) => entry.period_id === periodId);
  }

  function assignmentsForPeriod(periodId: string) {
    return Object.fromEntries(lineupForPeriod(periodId).map((entry) => [entry.position_slot_id, entry.player_id]));
  }

  function confirmDiscard() {
    return !isDirty || window.confirm("저장하지 않은 변경사항이 있습니다. 저장하지 않고 이동할까요?");
  }

  function changePeriod(periodId: string) {
    if (periodId === selectedPeriodId || !confirmDiscard()) return;

    const lineup = lineupForPeriod(periodId);
    const nextFormationId = lineup[0]?.formation_id ?? selectedFormationId;
    setSelectedPeriodId(periodId);
    setSelectedFormationId(nextFormationId);
    setAssignments(Object.fromEntries(lineup.map((entry) => [entry.position_slot_id, entry.player_id])));
    setIsDirty(false);
  }

  function changeFormation(formationId: string) {
    if (formationId === selectedFormationId) return;

    const nextFormation = formations.find((formation) => formation.id === formationId);
    if (!nextFormation) return;

    if (Object.values(assignments).some(Boolean)) {
      const ok = window.confirm("포메이션을 바꾸면 일부 배정이 미배정으로 이동할 수 있습니다. 계속할까요?");
      if (!ok) return;
    }

    const currentSlotsById = new Map(slots.map((slot) => [slot.id, slot]));
    const nextSlotsByCode = new Map(nextFormation.position_slots.map((slot) => [slot.position_code, slot]));
    const nextAssignments: Record<string, string> = {};

    for (const [slotId, playerId] of Object.entries(assignments)) {
      const positionCode = currentSlotsById.get(slotId)?.position_code;
      const nextSlot = positionCode ? nextSlotsByCode.get(positionCode) : null;
      if (nextSlot && playerId) nextAssignments[nextSlot.id] = playerId;
    }

    setSelectedFormationId(formationId);
    setAssignments(nextAssignments);
    setIsDirty(true);
  }

  function resetLineup() {
    const lineup = lineupForPeriod(selectedPeriodId);
    setSelectedFormationId(lineup[0]?.formation_id ?? formations[0]?.id ?? "");
    setAssignments(assignmentsForPeriod(selectedPeriodId));
    setIsDirty(false);
  }

  function assignPlayer(slotId: string, playerId: string) {
    setAssignments((current) => {
      const withoutPlayer = Object.fromEntries(Object.entries(current).filter(([, currentPlayerId]) => currentPlayerId !== playerId));

      if (playerId === EMPTY_PLAYER_VALUE) {
        const next = { ...current };
        delete next[slotId];
        return next;
      }

      return { ...withoutPlayer, [slotId]: playerId };
    });
    setIsDirty(true);
  }

  function handleDragEnd(event: DragEndEvent) {
    if (!canEdit) return;

    const player = event.active.data.current?.player as Player | undefined;
    const overId = event.over?.id.toString();
    setActivePlayer(null);

    if (!player || !overId) return;

    setAssignments((current) => {
      const withoutPlayer = Object.fromEntries(Object.entries(current).filter(([, playerId]) => playerId !== player.id));

      if (overId === "bench") return withoutPlayer;
      if (!overId.startsWith("slot:")) return current;

      const slotId = overId.replace("slot:", "");
      return { ...withoutPlayer, [slotId]: player.id };
    });
    setIsDirty(true);
  }

  const assignedCount = Object.values(assignments).filter(Boolean).length;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) => setActivePlayer(event.active.data.current?.player as Player)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActivePlayer(null)}
    >
      <form action={formAction} className="grid gap-5" onSubmit={() => setIsDirty(false)}>
        <input type="hidden" name="season_id" value={seasonId} />
        <input type="hidden" name="match_id" value={matchId} />
        <input type="hidden" name="period_id" value={selectedPeriodId} />
        <input type="hidden" name="formation_id" value={selectedFormationId} />
        {Object.entries(assignments).map(([slotId, playerId]) =>
          playerId ? <input key={slotId} type="hidden" name={`slot_${slotId}`} value={playerId} /> : null,
        )}

        <div className="rounded-lg border border-slate-800 bg-bg-secondary p-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="grid gap-3">
              <div className="flex flex-wrap gap-2">
                {periods.map((period) => (
                  <button
                    key={period.id}
                    type="button"
                    onClick={() => changePeriod(period.id)}
                    className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
                      selectedPeriodId === period.id
                        ? "border-accent-blue bg-sky-950/50 text-white"
                        : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
              <label className="grid max-w-xs gap-1 text-sm text-slate-300">
                Formation
                <Select value={selectedFormationId} onChange={(event) => changeFormation(event.target.value)} disabled={!canEdit}>
                  {formations.map((formation) => (
                    <option key={formation.id} value={formation.id}>
                      {formation.name}
                    </option>
                  ))}
                </Select>
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <span className={`text-sm ${isDirty ? "text-accent-blue" : "text-slate-400"}`}>
                {isDirty ? "저장되지 않은 변경사항" : selectedPeriod ? `${selectedPeriod.label} 저장 상태` : "Period 없음"}
              </span>
              {canEdit ? (
                <>
                  <Button type="button" variant="secondary" disabled={!isDirty || pending} onClick={resetLineup}>
                    되돌리기
                  </Button>
                  <Button type="submit" disabled={pending || !selectedPeriodId || !selectedFormationId || assignedCount === 0}>
                    {pending ? "Saving..." : "Save lineup"}
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">Pitch</h2>
              <span className="text-xs text-slate-400">{assignedCount}/{slots.length} assigned</span>
            </div>
            <div className="relative aspect-[7/5] min-h-[360px] overflow-hidden rounded-lg border border-emerald-500/40 bg-emerald-950">
              <div className="absolute inset-4 rounded-lg border border-white/35" />
              <div className="absolute left-1/2 top-4 h-[calc(100%-2rem)] w-px bg-white/25" />
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
              {slots.map((slot) => (
                <PositionSlotDroppable
                  key={slot.id}
                  slot={slot}
                  player={playersById.get(assignments[slot.id] ?? "") ?? null}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">Positions</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{unassignedPlayers.length} unassigned</span>
                {canEdit ? (
                  <Button type="button" variant="secondary" className="min-h-8 px-3 py-1 text-xs" onClick={() => setGuestModalOpen(true)}>
                    Add guest
                  </Button>
                ) : null}
              </div>
            </div>
            <div className="grid gap-2 rounded-lg border border-slate-800 bg-slate-950 p-3">
              {orderedSlots.map((slot) => {
                const playerId = assignments[slot.id];
                const player = playerId ? playersById.get(playerId) : null;
                return (
                  <div key={slot.id} className="grid gap-2 rounded-md border border-slate-800 bg-slate-900 p-2">
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                      <span className="font-bold text-accent-green">{slot.position_code}</span>
                      {player ? <span>#{player.number} {player.name}</span> : <span>Empty</span>}
                    </div>
                    {canEdit ? (
                      <Select value={playerId ?? EMPTY_PLAYER_VALUE} onChange={(event) => assignPlayer(slot.id, event.target.value)}>
                        <option value={EMPTY_PLAYER_VALUE}>비워두기</option>
                        {squadPlayers.map((squadPlayer) => (
                          <option key={squadPlayer.id} value={squadPlayer.id}>
                            #{squadPlayer.number} {squadPlayer.name}
                            {assignments[slot.id] !== squadPlayer.id && assignedPlayerIds.has(squadPlayer.id) ? " (배정됨)" : ""}
                          </option>
                        ))}
                      </Select>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold text-slate-100">Unassigned</h3>
              <BenchDroppable>
                {unassignedPlayers.map((player) =>
                  canEdit ? (
                    <PlayerDraggable key={player.id} player={player} />
                  ) : (
                    <div key={player.id} className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300">
                      <span className="flex items-center gap-2">
                        #{player.number} {player.name}
                        {player.player_type === "guest" ? <Badge tone="blue">Guest</Badge> : null}
                      </span>
                    </div>
                  ),
                )}
                {unassignedPlayers.length === 0 ? <p className="text-sm text-slate-500">All selected players are on the board.</p> : null}
              </BenchDroppable>
            </div>
          </section>
        </div>

        {periods.length === 0 ? <p className="text-sm text-accent-red">Create match periods before saving a lineup.</p> : null}
        {formations.length === 0 ? <p className="text-sm text-accent-red">Create at least one formation before saving a lineup.</p> : null}
        {squadPlayers.length === 0 ? <p className="text-sm text-accent-red">Add players to this season squad before saving a lineup.</p> : null}
        {state.message ? <p className={`text-sm ${state.ok ? "text-accent-green" : "text-accent-red"}`}>{state.message}</p> : null}

        {!canEdit ? (
          <p className="text-sm text-slate-400">Sign in with an approved editor account to update the lineup.</p>
        ) : null}
      </form>

      <DragOverlay>
        {activePlayer ? (
          <div className="rounded-md border border-accent-blue bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-100 shadow-xl">
            <span className="flex items-center gap-2">
              #{activePlayer.number} {activePlayer.name}
              {activePlayer.player_type === "guest" ? <Badge tone="blue">Guest</Badge> : null}
            </span>
          </div>
        ) : null}
      </DragOverlay>

      {guestModalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 px-4">
          <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-950 p-5 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">Add guest</h2>
                <p className="mt-1 text-sm text-slate-400">The guest will be added to this season squad.</p>
              </div>
              <button
                type="button"
                className="rounded-md border border-slate-700 px-2 py-1 text-sm text-slate-300 hover:bg-slate-900"
                onClick={() => setGuestModalOpen(false)}
              >
                Close
              </button>
            </div>
            <form action={guestFormAction} className="grid gap-3">
              <input type="hidden" name="season_id" value={seasonId} />
              <input type="hidden" name="match_id" value={matchId} />
              <label className="grid gap-1 text-sm text-slate-300">
                Name
                <Input name="name" required placeholder="Guest name" />
              </label>
              <label className="grid gap-1 text-sm text-slate-300">
                Number
                <Input name="number" type="number" min="0" placeholder="Leave blank for an automatic 9000-range number" />
              </label>
              {guestState.message ? (
                <p className={`text-sm ${guestState.ok ? "text-accent-green" : "text-accent-red"}`}>{guestState.message}</p>
              ) : null}
              <Button type="submit" disabled={guestPending}>
                {guestPending ? "Adding..." : "Add guest"}
              </Button>
            </form>
          </div>
        </div>
      ) : null}
    </DndContext>
  );
}
