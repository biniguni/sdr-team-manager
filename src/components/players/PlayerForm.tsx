"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
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
      <Input name="name" placeholder="Player name" defaultValue={player?.name ?? ""} required />
      <Input name="number" type="number" min="0" placeholder="Number" defaultValue={player?.number ?? ""} required />
      <Select name="player_type" defaultValue={player?.player_type ?? "member"}>
        <option value="member">Member</option>
        <option value="guest">Guest</option>
      </Select>
      <Input name="birth_date" type="date" defaultValue={player?.birth_date ?? ""} />
      <Input name="contact" placeholder="Contact" defaultValue={player?.contact ?? ""} />
      <Textarea name="memo" placeholder="Memo" defaultValue={player?.memo ?? ""} />
      {player ? (
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input name="is_active" type="checkbox" defaultChecked={player.is_active} />
          Active
        </label>
      ) : null}
      {!state.ok ? <p className="text-sm text-accent-red">{state.message}</p> : null}
      <Button type="submit" disabled={pending}>{pending ? "Saving..." : submitLabel}</Button>
    </form>
  );
}
