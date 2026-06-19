"use client";

import { useActionState, useMemo, useState } from "react";
import { saveLineup } from "@/actions/lineups";
import { Button } from "@/components/ui/Button";
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

export function SimpleLineupForm({
  seasonId,
  matchId,
  periods,
  formations,
  squadPlayers,
  existingLineups,
}: {
  seasonId: string;
  matchId: string;
  periods: Period[];
  formations: FormationWithSlots[];
  squadPlayers: Player[];
  existingLineups: ExistingLineup[];
}) {
  const [selectedPeriodId, setSelectedPeriodId] = useState(periods[0]?.id ?? "");
  const periodLineup = existingLineups.filter((entry) => entry.period_id === selectedPeriodId);
  const initialFormationId = periodLineup[0]?.formation_id ?? formations[0]?.id ?? "";
  const [selectedFormationId, setSelectedFormationId] = useState(initialFormationId);
  const [assignments, setAssignments] = useState<Record<string, string>>(() =>
    Object.fromEntries(periodLineup.map((entry) => [entry.position_slot_id, entry.player_id])),
  );
  const [state, formAction, pending] = useActionState(saveLineup, initialState);

  const selectedFormation = formations.find((formation) => formation.id === selectedFormationId);
  const slots = useMemo(
    () => [...(selectedFormation?.position_slots ?? [])].sort((a, b) => a.y - b.y || a.x - b.x),
    [selectedFormation],
  );

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

  const selectedPlayerIds = new Set(Object.values(assignments).filter(Boolean));
  const hasDuplicatePlayers = selectedPlayerIds.size !== Object.values(assignments).filter(Boolean).length;

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="season_id" value={seasonId} />
      <input type="hidden" name="match_id" value={matchId} />
      <input type="hidden" name="period_id" value={selectedPeriodId} />
      <input type="hidden" name="formation_id" value={selectedFormationId} />

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
          포메이션
          <Select value={selectedFormationId} onChange={(event) => changeFormation(event.target.value)}>
            {formations.map((formation) => (
              <option key={formation.id} value={formation.id}>
                {formation.name}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {slots.map((slot) => {
          const selectedPlayerId = assignments[slot.id] ?? "";

          return (
            <label key={slot.id} className="grid gap-2 rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300">
              <span className="font-semibold text-slate-100">{slot.position_code}</span>
              <Select
                name={`slot_${slot.id}`}
                value={selectedPlayerId}
                onChange={(event) =>
                  setAssignments((current) => ({
                    ...current,
                    [slot.id]: event.target.value,
                  }))
                }
              >
                <option value="">Unassigned</option>
                {squadPlayers.map((player) => {
                  const alreadyUsed = selectedPlayerIds.has(player.id) && selectedPlayerId !== player.id;

                  return (
                    <option key={player.id} value={player.id} disabled={alreadyUsed}>
                      #{player.number} {player.name}
                    </option>
                  );
                })}
              </Select>
            </label>
          );
        })}
      </div>

      {periods.length === 0 ? <p className="text-sm text-accent-red">라인업을 저장하려면 쿼터를 먼저 생성하세요.</p> : null}
      {formations.length === 0 ? <p className="text-sm text-accent-red">Create at least one formation before saving a lineup.</p> : null}
      {squadPlayers.length === 0 ? <p className="text-sm text-accent-red">라인업을 저장하려면 스쿼드에 선수를 먼저 추가하세요.</p> : null}
      {hasDuplicatePlayers ? <p className="text-sm text-accent-red">A player can only be used once per period.</p> : null}
      {state.message ? <p className={`text-sm ${state.ok ? "text-accent-green" : "text-accent-red"}`}>{state.message}</p> : null}

      <Button type="submit" disabled={pending || hasDuplicatePlayers || !selectedPeriodId || !selectedFormationId || squadPlayers.length === 0}>
        {pending ? "저장 중..." : "라인업 저장"}
      </Button>
    </form>
  );
}
