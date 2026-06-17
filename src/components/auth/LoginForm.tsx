"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ActionResult } from "@/types";

const initialState: ActionResult = { ok: true, message: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <label className="grid gap-1 text-sm text-slate-300">
        이메일
        <Input name="email" type="email" autoComplete="email" required />
      </label>
      <label className="grid gap-1 text-sm text-slate-300">
        비밀번호
        <Input name="password" type="password" autoComplete="current-password" required />
      </label>
      {!state.ok ? <p className="text-sm text-accent-red">{state.message}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
