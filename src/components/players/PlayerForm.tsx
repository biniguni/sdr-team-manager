"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { ActionResult, Player } from "@/types";

const initialState: ActionResult = { ok: true, message: "" };

export function PlayerForm({
  player,
  action,
  submitLabel,
}: {
  player?: Player;
  action: (state: ActionResult, formData: FormData) => Promise<ActionResult>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid gap-3">
      {player ? <input type="hidden" name="id" value={player.id} /> : null}
      <Input name="name" placeholder="선수명" defaultValue={player?.name ?? ""} required />
      <Input name="number" type="number" min="0" placeholder="등번호" defaultValue={player?.number ?? ""} required />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm text-slate-300">
          왼발
          <Select name="left_foot_score" defaultValue={String(player?.left_foot_score ?? 3)}>
            {[1, 2, 3, 4, 5].map((score) => (
              <option key={score} value={score}>
                {score}
              </option>
            ))}
          </Select>
        </label>
        <label className="grid gap-1 text-sm text-slate-300">
          오른발
          <Select name="right_foot_score" defaultValue={String(player?.right_foot_score ?? 3)}>
            {[1, 2, 3, 4, 5].map((score) => (
              <option key={score} value={score}>
                {score}
              </option>
            ))}
          </Select>
        </label>
      </div>
      <Select name="player_type" defaultValue={player?.player_type ?? "member"}>
        <option value="member">선수</option>
        <option value="guest">용병</option>
      </Select>
      {player ? (
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input name="is_active" type="checkbox" defaultChecked={player.is_active} />
          활동여부
        </label>
      ) : null}
      {!state.ok ? <p className="text-sm text-accent-red">{state.message}</p> : null}
      <Button type="submit" disabled={pending}>{pending ? "저장 중..." : submitLabel}</Button>
    </form>
  );
}
