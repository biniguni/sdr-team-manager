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
  const [state, formAction, pending] = useActionState(saveLineup, initialState);
  const [guestState, guestFormAction, guestPending] = useActionState(createGuestPlayerForLineup, initialState);

  useEffect(() => {
    if (!guestState.ok || !guestState.message) return;
    router.refresh();
  }, [guestState.ok, guestState.message, router]);

  const selectedFormation = formations.find((formation) => formation.id === selectedFormationId);
  const slots = useMemo(() => selectedFormation?.position_slots ?? [], [selectedFormation]);
  const playersById = useMemo(() => new Map(squadPlayers.map((player) => [player.id, player])), [squadPlayers]);
  const assignedPlayerIds = new Set(Object.values(assignments).filter(Boolean));
  const unassignedPlayers = squadPlayers.filter((player) => !assignedPlayerIds.has(player.id));

  function changePeriod(periodId: string) {
    const lineup = existingLineups.filter((entry) => entry.period_id === periodId);
    const nextFormationId = lineup[0]?.formation_id ?? selectedFormationId;
    setSelectedPeriodId(periodId);
    setSelectedFormationId(nextFormationId);
    setAssignments(Object.fromEntries(lineup.map((entry) => [entry.position_slot_id, entry.player_id])));
  }

  function changeFormation(formationId: string) {
    setSelectedFormationId(formationId);
    setAssignments({});
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
  }

  const assignedCount = Object.values(assignments).filter(Boolean).length;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) => setActivePlayer(event.active.data.current?.player as Player)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActivePlayer(null)}
    >
      <form action={formAction} className="grid gap-5">
        <input type="hidden" name="season_id" value={seasonId} />
        <input type="hidden" name="match_id" value={matchId} />
        <input type="hidden" name="period_id" value={selectedPeriodId} />
        <input type="hidden" name="formation_id" value={selectedFormationId} />
        {Object.entries(assignments).map(([slotId, playerId]) =>
          playerId ? <input key={slotId} type="hidden" name={`slot_${slotId}`} value={playerId} /> : null,
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-1 text-sm text-slate-300">
            Period
            <Select value={selectedPeriodId} onChange={(event) => changePeriod(event.target.value)}>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.order_num}. {period.label}
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-1 text-sm text-slate-300">
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

        <div className="grid gap-5 xl:grid-cols-[260px_1fr]">
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">Squad</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{unassignedPlayers.length} available</span>
                {canEdit ? (
                  <Button type="button" variant="secondary" className="min-h-8 px-3 py-1 text-xs" onClick={() => setGuestModalOpen(true)}>
                    Add guest
                  </Button>
                ) : null}
              </div>
            </div>
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
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">Field</h2>
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
        </div>

        {periods.length === 0 ? <p className="text-sm text-accent-red">Create match periods before saving a lineup.</p> : null}
        {formations.length === 0 ? <p className="text-sm text-accent-red">Create at least one formation before saving a lineup.</p> : null}
        {squadPlayers.length === 0 ? <p className="text-sm text-accent-red">Add players to this season squad before saving a lineup.</p> : null}
        {state.message ? <p className={`text-sm ${state.ok ? "text-accent-green" : "text-accent-red"}`}>{state.message}</p> : null}

        {canEdit ? (
          <Button type="submit" disabled={pending || !selectedPeriodId || !selectedFormationId || assignedCount === 0}>
            {pending ? "Saving..." : "Save lineup"}
          </Button>
        ) : (
          <p className="text-sm text-slate-400">Sign in with an approved editor account to update the lineup.</p>
        )}
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
