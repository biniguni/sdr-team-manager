"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireEditor, requireMatchResultManager } from "@/lib/authz";
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

function integerOrNull(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

function fail(message: string): ActionResult {
  return { ok: false, message };
}

function periodLabels(formData: FormData) {
  const labels = text(formData, "periods")
    .split(/\r?\n|,/)
    .map((label) => label.trim())
    .filter(Boolean);

  if (labels.length > 0) return labels.slice(0, 4);
  return text(formData, "period_mode") === "halves" ? ["전반", "후반"] : ["1Q", "2Q", "3Q", "4Q"];
}

export async function createMatch(formData: FormData): Promise<ActionResult> {
  const editor = await requireEditor();
  if (!editor.ok) return fail(editor.message);

  const seasonId = text(formData, "season_id");
  const opponent = text(formData, "opponent");
  const matchDate = text(formData, "match_date");

  if (!seasonId || !opponent || !matchDate) {
    return fail("Season, opponent, and match date are required.");
  }

  const supabase = await createClient();
  const { data: season } = await supabase.from("seasons").select("is_active").eq("id", seasonId).single();
  if (!season?.is_active) return fail("Matches can only be added to active seasons.");

  const { data: match, error } = await supabase
    .from("matches")
    .insert({
      season_id: seasonId,
      opponent,
      match_date: matchDate,
      venue: optionalText(formData, "venue"),
      is_home: formData.get("is_home") === "on",
    })
    .select("id")
    .single();

  if (error || !match) return fail(error?.message ?? "Match could not be created.");

  const periods = periodLabels(formData).map((label, index) => ({
    match_id: match.id,
    label,
    order_num: index + 1,
  }));
  const { error: periodError } = await supabase.from("periods").insert(periods);
  if (periodError) return fail(periodError.message);

  revalidatePath(`/seasons/${seasonId}/matches`);
  redirect(`/seasons/${seasonId}/matches/${match.id}`);
}

export async function createMatchSubmit(formData: FormData): Promise<void> {
  await createMatch(formData);
}

export async function updateMatch(formData: FormData): Promise<ActionResult> {
  const editor = await requireEditor();
  if (!editor.ok) return fail(editor.message);

  const id = text(formData, "id");
  const seasonId = text(formData, "season_id");
  const opponent = text(formData, "opponent");
  const matchDate = text(formData, "match_date");

  if (!id || !seasonId || !opponent || !matchDate) return fail("Match id, opponent, and match date are required.");

  const resultFieldsSubmitted =
    formData.has("our_score") ||
    formData.has("opponent_score") ||
    formData.has("match_mom_player_id") ||
    formData.has("defense_mom_player_id") ||
    formData.has("midfield_mom_player_id") ||
    formData.has("attack_mom_player_id") ||
    formData.has("status");

  if (resultFieldsSubmitted) {
    const resultManager = await requireMatchResultManager();
    if (!resultManager.ok) return fail(resultManager.message);
  }

  const updatePayload: Record<string, string | number | boolean | null> = {
    opponent,
    match_date: matchDate,
    venue: optionalText(formData, "venue"),
    is_home: formData.get("is_home") === "on",
  };

  if (resultFieldsSubmitted) {
    updatePayload.our_score = integerOrNull(formData, "our_score");
    updatePayload.opponent_score = integerOrNull(formData, "opponent_score");
    updatePayload.match_mom_player_id = optionalText(formData, "match_mom_player_id");
    updatePayload.defense_mom_player_id = optionalText(formData, "defense_mom_player_id");
    updatePayload.midfield_mom_player_id = optionalText(formData, "midfield_mom_player_id");
    updatePayload.attack_mom_player_id = optionalText(formData, "attack_mom_player_id");
    updatePayload.status = text(formData, "status") === "completed" ? "completed" : "scheduled";
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("matches")
    .update(updatePayload)
    .eq("id", id);

  if (error) return fail(error.message);

  revalidatePath(`/seasons/${seasonId}/matches/${id}`);
  redirect(`/seasons/${seasonId}/matches/${id}`);
}

export async function updateMatchSubmit(formData: FormData): Promise<void> {
  await updateMatch(formData);
}

export async function completeMatch(formData: FormData): Promise<ActionResult> {
  const resultManager = await requireMatchResultManager();
  if (!resultManager.ok) return fail(resultManager.message);

  const id = text(formData, "id");
  const seasonId = text(formData, "season_id");
  if (!id || !seasonId) return fail("Match id is missing.");

  const supabase = await createClient();
  const { data: periods } = await supabase
    .from("periods")
    .select("id, period_lineups(id)")
    .eq("match_id", id);

  const emptyPeriods = periods?.filter((period) => !period.period_lineups || period.period_lineups.length === 0) ?? [];
  if (emptyPeriods.length > 0) {
    return fail("Some periods do not have lineups yet. The match can still be saved, but completion is blocked.");
  }

  const { error } = await supabase.from("matches").update({ status: "completed" }).eq("id", id);
  if (error) return fail(error.message);

  revalidatePath(`/seasons/${seasonId}/matches/${id}`);
  redirect(`/seasons/${seasonId}/matches/${id}`);
}

export async function completeMatchSubmit(formData: FormData): Promise<void> {
  await completeMatch(formData);
}
