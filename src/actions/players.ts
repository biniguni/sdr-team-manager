"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireEditor } from "@/lib/authz";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(formData: FormData, key: string) {
  const value = Number(text(formData, key));
  return Number.isInteger(value) ? value : null;
}

function footScore(formData: FormData, key: string) {
  const value = numberValue(formData, key);
  return value !== null && value >= 1 && value <= 5 ? value : null;
}

function fail(message: string): ActionResult {
  return { ok: false, message };
}

export async function createPlayer(formData: FormData): Promise<ActionResult> {
  const editor = await requireEditor();
  if (!editor.ok) return fail(editor.message);

  const name = text(formData, "name");
  const number = numberValue(formData, "number");
  const leftFootScore = footScore(formData, "left_foot_score");
  const rightFootScore = footScore(formData, "right_foot_score");

  if (!name) return fail("선수명을 입력하세요.");
  if (number === null) return fail("등번호를 입력하세요.");
  if (leftFootScore === null || rightFootScore === null) return fail("왼발/오른발 점수는 1부터 5까지 입력하세요.");

  const supabase = await createClient();
  const { error } = await supabase.from("players").insert({
    name,
    number,
    left_foot_score: leftFootScore,
    right_foot_score: rightFootScore,
    player_type: text(formData, "player_type") === "guest" ? "guest" : "member",
  });

  if (error) {
    return fail(error.code === "23505" ? "이미 사용 중인 등번호입니다." : error.message);
  }

  revalidatePath("/players");
  redirect("/players");
}

export async function createPlayerForm(_: ActionResult, formData: FormData): Promise<ActionResult> {
  return createPlayer(formData);
}

export async function updatePlayer(formData: FormData): Promise<ActionResult> {
  const editor = await requireEditor();
  if (!editor.ok) return fail(editor.message);

  const id = text(formData, "id");
  const name = text(formData, "name");
  const number = numberValue(formData, "number");
  const leftFootScore = footScore(formData, "left_foot_score");
  const rightFootScore = footScore(formData, "right_foot_score");

  if (!id) return fail("선수 정보가 없습니다.");
  if (!name) return fail("선수명을 입력하세요.");
  if (number === null) return fail("등번호를 입력하세요.");
  if (leftFootScore === null || rightFootScore === null) return fail("왼발/오른발 점수는 1부터 5까지 입력하세요.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("players")
    .update({
      name,
      number,
      left_foot_score: leftFootScore,
      right_foot_score: rightFootScore,
      player_type: text(formData, "player_type") === "guest" ? "guest" : "member",
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id);

  if (error) {
    return fail(error.code === "23505" ? "이미 사용 중인 등번호입니다." : error.message);
  }

  revalidatePath("/players");
  redirect("/players");
}

export async function updatePlayerForm(_: ActionResult, formData: FormData): Promise<ActionResult> {
  return updatePlayer(formData);
}

export async function deactivatePlayer(formData: FormData): Promise<ActionResult> {
  const editor = await requireEditor();
  if (!editor.ok) return fail(editor.message);

  const id = text(formData, "id");
  if (!id) return fail("선수 정보가 없습니다.");

  const supabase = await createClient();
  const { error } = await supabase.from("players").update({ is_active: false }).eq("id", id);

  if (error) return fail(error.message);

  revalidatePath("/players");
  redirect("/players");
}

export async function deactivatePlayerSubmit(formData: FormData): Promise<void> {
  await deactivatePlayer(formData);
}
