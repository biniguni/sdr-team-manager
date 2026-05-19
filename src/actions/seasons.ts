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

function fail(message: string): ActionResult {
  return { ok: false, message };
}

export async function createSeason(formData: FormData): Promise<ActionResult> {
  const editor = await requireEditor();
  if (!editor.ok) return fail(editor.message);

  const name = text(formData, "name");
  const start_date = text(formData, "start_date");
  const end_date = text(formData, "end_date");

  if (!name || !start_date || !end_date) return fail("Season name, start date, and end date are required.");
  if (end_date < start_date) return fail("Season end date must be on or after the start date.");

  const supabase = await createClient();
  const { error } = await supabase.from("seasons").insert({ name, start_date, end_date });

  if (error) return fail(error.message);

  revalidatePath("/seasons");
  redirect("/seasons");
}

export async function createSeasonSubmit(formData: FormData): Promise<void> {
  await createSeason(formData);
}

export async function updateSeason(formData: FormData): Promise<ActionResult> {
  const editor = await requireEditor();
  if (!editor.ok) return fail(editor.message);

  const id = text(formData, "id");
  const name = text(formData, "name");
  const start_date = text(formData, "start_date");
  const end_date = text(formData, "end_date");

  if (!id) return fail("Season id is missing.");
  if (!name || !start_date || !end_date) return fail("Season name, start date, and end date are required.");
  if (end_date < start_date) return fail("Season end date must be on or after the start date.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("seasons")
    .update({ name, start_date, end_date, is_active: formData.get("is_active") === "on" })
    .eq("id", id);

  if (error) return fail(error.message);

  revalidatePath("/seasons");
  revalidatePath(`/seasons/${id}`);
  redirect(`/seasons/${id}`);
}

export async function updateSeasonSubmit(formData: FormData): Promise<void> {
  await updateSeason(formData);
}

export async function addSquadMember(formData: FormData): Promise<ActionResult> {
  const editor = await requireEditor();
  if (!editor.ok) return fail(editor.message);

  const seasonId = text(formData, "season_id");
  const playerId = text(formData, "player_id");

  if (!seasonId || !playerId) return fail("Choose an active player to add.");

  const supabase = await createClient();
  const { data: player } = await supabase.from("players").select("is_active").eq("id", playerId).single();
  if (!player?.is_active) return fail("Only active players can be added to a squad.");

  const { error } = await supabase
    .from("squad_members")
    .insert({ season_id: seasonId, player_id: playerId });

  if (error) {
    return fail(error.code === "23505" ? "That player is already in this squad." : error.message);
  }

  revalidatePath(`/seasons/${seasonId}`);
  redirect(`/seasons/${seasonId}`);
}

export async function addSquadMemberSubmit(formData: FormData): Promise<void> {
  await addSquadMember(formData);
}

export async function removeSquadMember(formData: FormData): Promise<ActionResult> {
  const editor = await requireEditor();
  if (!editor.ok) return fail(editor.message);

  const seasonId = text(formData, "season_id");
  const playerId = text(formData, "player_id");
  if (!seasonId || !playerId) return fail("Squad member is missing.");

  const supabase = await createClient();
  const { data: assigned } = await supabase
    .from("period_lineups")
    .select("id, periods!inner(matches!inner(season_id))")
    .eq("player_id", playerId)
    .eq("periods.matches.season_id", seasonId)
    .limit(1);

  if (assigned && assigned.length > 0) {
    return fail("This player is already used in a lineup for this season and cannot be removed.");
  }

  const { error } = await supabase
    .from("squad_members")
    .delete()
    .eq("season_id", seasonId)
    .eq("player_id", playerId);

  if (error) return fail(error.message);

  revalidatePath(`/seasons/${seasonId}`);
  redirect(`/seasons/${seasonId}`);
}

export async function removeSquadMemberSubmit(formData: FormData): Promise<void> {
  await removeSquadMember(formData);
}
