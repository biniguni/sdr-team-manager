"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

type LineupEntryInput = {
  position_slot_id: string;
  player_id: string;
};

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function fail(message: string): ActionResult {
  return { ok: false, message };
}

export async function saveLineup(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const periodId = text(formData, "period_id");
  const formationId = text(formData, "formation_id");
  const seasonId = text(formData, "season_id");
  const matchId = text(formData, "match_id");

  if (!periodId) return fail("Choose a period before saving the lineup.");
  if (!formationId) return fail("Choose a formation before saving the lineup.");
  if (!seasonId || !matchId) return fail("Match context is missing.");

  const entries: LineupEntryInput[] = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("slot_") || typeof value !== "string" || !value) continue;
    entries.push({
      position_slot_id: key.replace("slot_", ""),
      player_id: value,
    });
  }

  if (entries.length === 0) return fail("Assign at least one player before saving.");

  const assignedPlayers = entries.map((entry) => entry.player_id);
  if (new Set(assignedPlayers).size !== assignedPlayers.length) {
    return fail("The same player cannot be assigned more than once in the same period.");
  }

  const supabase = await createClient();

  const [{ data: slots, error: slotsError }, { data: squad, error: squadError }] = await Promise.all([
    supabase.from("position_slots").select("id").eq("formation_id", formationId),
    supabase.from("squad_members").select("player_id").eq("season_id", seasonId),
  ]);

  if (slotsError) return fail(slotsError.message);
  if (squadError) return fail(squadError.message);

  const slotIds = new Set((slots ?? []).map((slot) => slot.id));
  const squadPlayerIds = new Set((squad ?? []).map((member) => member.player_id));

  if (entries.some((entry) => !slotIds.has(entry.position_slot_id))) {
    return fail("One or more selected positions do not belong to the chosen formation.");
  }

  if (entries.some((entry) => !squadPlayerIds.has(entry.player_id))) {
    return fail("Only players in this season squad can be assigned.");
  }

  const { error: deleteError } = await supabase.from("period_lineups").delete().eq("period_id", periodId);
  if (deleteError) return fail(deleteError.message);

  const { error: insertError } = await supabase.from("period_lineups").insert(
    entries.map((entry) => ({
      period_id: periodId,
      formation_id: formationId,
      position_slot_id: entry.position_slot_id,
      player_id: entry.player_id,
    })),
  );

  if (insertError) {
    return fail(
      insertError.code === "23505"
        ? "A player or position was assigned more than once in this period."
        : insertError.message,
    );
  }

  const performanceError = await refreshPositionPerformance(seasonId);
  if (performanceError) return fail(performanceError);

  revalidatePath(`/seasons/${seasonId}/matches/${matchId}/lineup`);
  revalidatePath(`/seasons/${seasonId}/matches/${matchId}`);
  return { ok: true, message: "Lineup saved." };
}

export async function createGuestPlayerForLineup(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const seasonId = text(formData, "season_id");
  const matchId = text(formData, "match_id");
  const name = text(formData, "name");
  const numberText = text(formData, "number");
  const memo = text(formData, "memo");

  if (!seasonId || !matchId) return fail("Match context is missing.");
  if (!name) return fail("Guest name is required.");

  const explicitNumber = numberText ? Number(numberText) : null;
  if (explicitNumber !== null && (!Number.isInteger(explicitNumber) || explicitNumber < 0)) {
    return fail("Guest number must be zero or greater.");
  }

  const supabase = await createClient();
  let nextNumber = explicitNumber;

  if (nextNumber === null) {
    const { data: latestGuest, error: latestGuestError } = await supabase
      .from("players")
      .select("number")
      .gte("number", 9000)
      .lt("number", 10000)
      .order("number", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestGuestError) return fail(latestGuestError.message);
    nextNumber = Math.max((latestGuest?.number ?? 9000) + 1, 9001);
  }

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidateNumber = explicitNumber ?? nextNumber + attempt;
    const { data: player, error: playerError } = await supabase
      .from("players")
      .insert({
        name,
        number: candidateNumber,
        player_type: "guest",
        memo: memo || null,
      })
      .select("id")
      .single();

    if (playerError) {
      if (!explicitNumber && playerError.code === "23505") continue;
      return fail(playerError.code === "23505" ? "That player number is already in use." : playerError.message);
    }

    const { error: squadError } = await supabase.from("squad_members").upsert(
      { season_id: seasonId, player_id: player.id },
      { onConflict: "season_id,player_id" },
    );

    if (squadError) return fail(squadError.message);

    revalidatePath(`/seasons/${seasonId}`);
    revalidatePath(`/seasons/${seasonId}/matches/${matchId}`);
    revalidatePath(`/seasons/${seasonId}/matches/${matchId}/lineup`);
    revalidatePath(`/seasons/${seasonId}/matches/${matchId}/stats`);
    return { ok: true, message: `Guest player added: #${candidateNumber} ${name}` };
  }

  return fail("Could not assign a temporary guest number. Try entering a number manually.");
}

async function refreshPositionPerformance(seasonId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("period_lineups")
    .select("player_id, position_slots(position_code), periods!inner(id, matches!inner(id, season_id))")
    .eq("periods.matches.season_id", seasonId);

  if (error) return error.message;

  const groups = new Map<string, { player_id: string; position_code: string; period_count: number; matchIds: Set<string> }>();

  for (const row of (data ?? []) as unknown as Array<{
    player_id: string;
    position_slots: { position_code: string } | null;
    periods: { id: string; matches: { id: string; season_id: string } | null } | null;
  }>) {
    const positionCode = row.position_slots?.position_code;
    const matchId = row.periods?.matches?.id;
    if (!positionCode || !matchId) continue;

    const key = `${row.player_id}:${positionCode}`;
    const current = groups.get(key) ?? {
      player_id: row.player_id,
      position_code: positionCode,
      period_count: 0,
      matchIds: new Set<string>(),
    };
    current.period_count += 1;
    current.matchIds.add(matchId);
    groups.set(key, current);
  }

  const { error: deleteError } = await supabase.from("position_performance").delete().eq("season_id", seasonId);
  if (deleteError) return deleteError.message;

  const rows = [...groups.values()].map((group) => ({
    season_id: seasonId,
    player_id: group.player_id,
    position_code: group.position_code,
    period_count: group.period_count,
    match_count: group.matchIds.size,
  }));

  if (rows.length === 0) return null;

  const { error: insertError } = await supabase.from("position_performance").insert(rows);
  return insertError?.message ?? null;
}

export async function getLineup(periodId: string) {
  const supabase = await createClient();
  return supabase
    .from("period_lineups")
    .select("*, players(*), position_slots(*)")
    .eq("period_id", periodId);
}
