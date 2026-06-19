"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireEditor } from "@/lib/authz";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

type SlotInput = {
  position_code: string;
  x: number;
  y: number;
};

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function fail(message: string): ActionResult {
  return { ok: false, message };
}

function parseSlots(raw: string): SlotInput[] | string {
  const slots = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [position_code, xValue, yValue] = line.split(",").map((item) => item.trim());
      return { position_code, x: Number(xValue), y: Number(yValue) };
    });

  if (slots.length < 1 || slots.length > 11) return "A formation needs between 1 and 11 position slots.";
  if (slots.some((slot) => !slot.position_code || !Number.isFinite(slot.x) || !Number.isFinite(slot.y))) {
    return "Each slot must use the format POSITION,x,y.";
  }
  if (slots.some((slot) => slot.x < 0 || slot.x > 100 || slot.y < 0 || slot.y > 100)) {
    return "Slot coordinates must be between 0 and 100.";
  }

  const codes = new Set(slots.map((slot) => slot.position_code));
  if (codes.size !== slots.length) return "Position codes must be unique within a formation.";

  return slots;
}

export async function createFormation(formData: FormData): Promise<ActionResult> {
  const editor = await requireEditor();
  if (!editor.ok) return fail(editor.message);

  const name = text(formData, "name");
  const slots = parseSlots(text(formData, "slots"));

  if (!name) return fail("포메이션 이름을 입력하세요.");
  if (typeof slots === "string") return fail(slots);

  const supabase = await createClient();
  const { data: formation, error } = await supabase
    .from("formations")
    .insert({ name, is_default: false })
    .select("id")
    .single();

  if (error || !formation) {
    return fail(error?.code === "23505" ? "이미 사용 중인 포메이션 이름입니다." : error?.message ?? "포메이션을 생성하지 못했습니다.");
  }

  const { error: slotError } = await supabase.from("position_slots").insert(
    slots.map((slot) => ({
      formation_id: formation.id,
      position_code: slot.position_code,
      x: slot.x,
      y: slot.y,
    })),
  );

  if (slotError) return fail(slotError.message);

  revalidatePath("/formations");
  redirect("/formations");
}

export async function createFormationSubmit(formData: FormData): Promise<void> {
  await createFormation(formData);
}

export async function deleteFormation(formData: FormData): Promise<ActionResult> {
  const editor = await requireEditor();
  if (!editor.ok) return fail(editor.message);

  const id = text(formData, "id");
  if (!id) return fail("포메이션 정보가 없습니다.");

  const supabase = await createClient();
  const { data: used } = await supabase.from("period_lineups").select("id").eq("formation_id", id).limit(1);
  if (used && used.length > 0) return fail("This formation is already used in a lineup and cannot be deleted.");

  const { error } = await supabase.from("formations").delete().eq("id", id).eq("is_default", false);
  if (error) return fail(error.message);

  revalidatePath("/formations");
  redirect("/formations");
}

export async function deleteFormationSubmit(formData: FormData): Promise<void> {
  await deleteFormation(formData);
}
