"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value.length > 0 ? value : null;
}

function numberValue(formData: FormData, key: string) {
  const value = Number(text(formData, key));
  return Number.isInteger(value) ? value : null;
}

function fail(message: string): ActionResult {
  return { ok: false, message };
}

export async function createPlayer(formData: FormData): Promise<ActionResult> {
  const name = text(formData, "name");
  const number = numberValue(formData, "number");

  if (!name) return fail("Player name is required.");
  if (number === null) return fail("Player number is required.");

  const supabase = await createClient();
  const { error } = await supabase.from("players").insert({
    name,
    number,
    player_type: text(formData, "player_type") === "guest" ? "guest" : "member",
    birth_date: optionalText(formData, "birth_date"),
    contact: optionalText(formData, "contact"),
    memo: optionalText(formData, "memo"),
  });

  if (error) {
    return fail(error.code === "23505" ? "That player number is already in use." : error.message);
  }

  revalidatePath("/players");
  redirect("/players");
}

export async function createPlayerForm(_: ActionResult, formData: FormData): Promise<ActionResult> {
  return createPlayer(formData);
}

export async function updatePlayer(formData: FormData): Promise<ActionResult> {
  const id = text(formData, "id");
  const name = text(formData, "name");
  const number = numberValue(formData, "number");

  if (!id) return fail("Player id is missing.");
  if (!name) return fail("Player name is required.");
  if (number === null) return fail("Player number is required.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("players")
    .update({
      name,
      number,
      birth_date: optionalText(formData, "birth_date"),
      contact: optionalText(formData, "contact"),
      memo: optionalText(formData, "memo"),
      player_type: text(formData, "player_type") === "guest" ? "guest" : "member",
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id);

  if (error) {
    return fail(error.code === "23505" ? "That player number is already in use." : error.message);
  }

  revalidatePath("/players");
  redirect("/players");
}

export async function updatePlayerForm(_: ActionResult, formData: FormData): Promise<ActionResult> {
  return updatePlayer(formData);
}

export async function deactivatePlayer(formData: FormData): Promise<ActionResult> {
  const id = text(formData, "id");
  if (!id) return fail("Player id is missing.");

  const supabase = await createClient();
  const { error } = await supabase.from("players").update({ is_active: false }).eq("id", id);

  if (error) return fail(error.message);

  revalidatePath("/players");
  redirect("/players");
}

export async function deactivatePlayerSubmit(formData: FormData): Promise<void> {
  await deactivatePlayer(formData);
}
