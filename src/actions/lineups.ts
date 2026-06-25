"use server";

import { revalidatePath } from "next/cache";
import { requireEditor } from "@/lib/authz";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

type LineupEntryInput = {
  position_slot_id: string;
  match_roster_id: string;
};

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function fail(message: string): ActionResult {
  return { ok: false, message };
}

export async function saveLineup(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const editor = await requireEditor();
  if (!editor.ok) return fail(editor.message);

  const periodId = text(formData, "period_id");
  const formationId = text(formData, "formation_id");
  const seasonId = text(formData, "season_id");
  const matchId = text(formData, "match_id");

  if (!periodId) return fail("라인업을 저장하기 전에 쿼터를 선택하세요.");
  if (!formationId) return fail("라인업을 저장하기 전에 포메이션을 선택하세요.");
  if (!seasonId || !matchId) return fail("경기 정보가 없습니다.");

  const entries: LineupEntryInput[] = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("slot_") || typeof value !== "string" || !value) continue;
    entries.push({
      position_slot_id: key.replace("slot_", ""),
      match_roster_id: value,
    });
  }

  if (entries.length === 0) return fail("한 명 이상 등록한 뒤 저장하세요.");

  const assignedRosterIds = entries.map((entry) => entry.match_roster_id);
  if (new Set(assignedRosterIds).size !== assignedRosterIds.length) {
    return fail("동일한 쿼터에 같은 선수를 중복 등록할 수 없습니다.");
  }

  const supabase = await createClient();

  const [{ data: slots, error: slotsError }, { data: roster, error: rosterError }] = await Promise.all([
    supabase.from("position_slots").select("id").eq("formation_id", formationId),
    supabase.from("match_roster").select("id, player_id").eq("match_id", matchId),
  ]);

  if (slotsError) return fail(slotsError.message);
  if (rosterError) return fail(rosterError.message);

  const slotIds = new Set((slots ?? []).map((slot) => slot.id));
  const matchRosterById = new Map((roster ?? []).map((member) => [member.id, member.player_id ?? null]));

  if (entries.some((entry) => !slotIds.has(entry.position_slot_id))) {
    return fail("One or more selected positions do not belong to the chosen formation.");
  }

  if (entries.some((entry) => !matchRosterById.has(entry.match_roster_id))) {
    return fail("경기 명단에 추가된 선수만 배정할 수 있습니다.");
  }

  const { error: deleteError } = await supabase.from("period_lineups").delete().eq("period_id", periodId);
  if (deleteError) return fail(deleteError.message);

  const { error: insertError } = await supabase.from("period_lineups").insert(
    entries.map((entry) => ({
      period_id: periodId,
      formation_id: formationId,
      position_slot_id: entry.position_slot_id,
      match_roster_id: entry.match_roster_id,
      player_id: matchRosterById.get(entry.match_roster_id) ?? null,
    })),
  );

  if (insertError) {
    return fail(
      insertError.code === "23505"
        ? "같은 쿼터에서 선수 또는 포지션이 중복 배정되었습니다."
        : insertError.message,
    );
  }

  const performanceError = await refreshPositionPerformance(seasonId);
  if (performanceError) return fail(performanceError);

  revalidatePath("/lineup");
  revalidatePath(`/seasons/${seasonId}/matches/${matchId}/lineup`);
  revalidatePath(`/seasons/${seasonId}/matches/${matchId}`);
  return { ok: true, message: "라인업을 저장했습니다." };
}

export async function addMatchRosterPlayer(formData: FormData): Promise<ActionResult> {
  const editor = await requireEditor();
  if (!editor.ok) return fail(editor.message);

  const seasonId = text(formData, "season_id");
  const matchId = text(formData, "match_id");
  const playerId = text(formData, "player_id");

  if (!seasonId || !matchId || !playerId) return fail("이 경기 명단에 등록할 선수를 선택하세요.");

  const supabase = await createClient();
  const { data: squadMember, error: squadError } = await supabase
    .from("squad_members")
    .select("id, players!inner(player_type)")
    .eq("season_id", seasonId)
    .eq("player_id", playerId)
    .maybeSingle();

  if (squadError) return fail(squadError.message);
  if (!squadMember) return fail("이 시즌 스쿼드에 포함된 선수만 경기 명단에 추가할 수 있습니다.");
  if ((squadMember.players as { player_type?: string } | null)?.player_type !== "member") {
    return fail("등록 선수만 경기 명단에 추가할 수 있습니다.");
  }

  const { error } = await supabase.from("match_roster").upsert(
    { match_id: matchId, player_id: playerId },
    { onConflict: "match_id,player_id" },
  );

  if (error) return fail(error.message);

  revalidatePath("/lineup");
  revalidatePath(`/seasons/${seasonId}/matches/${matchId}`);
  revalidatePath(`/seasons/${seasonId}/matches/${matchId}/lineup`);
  revalidatePath(`/seasons/${seasonId}/matches/${matchId}/stats`);
  return { ok: true, message: "선수를 이 경기에 추가했습니다." };
}

export async function removeMatchRosterPlayer(formData: FormData): Promise<ActionResult> {
  const editor = await requireEditor();
  if (!editor.ok) return fail(editor.message);

  const seasonId = text(formData, "season_id");
  const matchId = text(formData, "match_id");
  const rosterId = text(formData, "match_roster_id");

  if (!seasonId || !matchId || !rosterId) return fail("경기 명단이 없습니다.");

  const supabase = await createClient();
  const { data: rosterMember, error: rosterMemberError } = await supabase
    .from("match_roster")
    .select("id, player_id")
    .eq("id", rosterId)
    .eq("match_id", matchId)
    .maybeSingle();

  if (rosterMemberError) return fail(rosterMemberError.message);
  if (!rosterMember) return fail("경기 명단이 없습니다.");

  const { data: existingLineup, error: lineupError } = await supabase
    .from("period_lineups")
    .select("id, periods!inner(match_id)")
    .eq("match_roster_id", rosterId)
    .eq("periods.match_id", matchId)
    .limit(1);

  if (lineupError) return fail(lineupError.message);
  if (existingLineup && existingLineup.length > 0) {
    return fail("라인업에서 먼저 제외한 뒤 경기 명단에서 제거하세요.");
  }

  if (rosterMember.player_id) {
    const { data: legacyLineup, error: legacyLineupError } = await supabase
      .from("period_lineups")
      .select("id, periods!inner(match_id)")
      .eq("player_id", rosterMember.player_id)
      .eq("periods.match_id", matchId)
      .limit(1);

    if (legacyLineupError) return fail(legacyLineupError.message);
    if (legacyLineup && legacyLineup.length > 0) {
      return fail("라인업에서 먼저 제외한 뒤 경기 명단에서 제거하세요.");
    }
  }

  const { error } = await supabase.from("match_roster").delete().eq("id", rosterId).eq("match_id", matchId);
  if (error) return fail(error.message);

  revalidatePath("/lineup");
  revalidatePath(`/seasons/${seasonId}/matches/${matchId}`);
  revalidatePath(`/seasons/${seasonId}/matches/${matchId}/lineup`);
  revalidatePath(`/seasons/${seasonId}/matches/${matchId}/stats`);
  return { ok: true, message: "경기 명단에서 제거했습니다." };
}

export async function addGuestToMatchRoster(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const editor = await requireEditor();
  if (!editor.ok) return fail(editor.message);

  const seasonId = text(formData, "season_id");
  const matchId = text(formData, "match_id");
  const name = text(formData, "name");
  const numberText = text(formData, "number");

  if (!seasonId || !matchId) return fail("경기 정보가 없습니다.");
  if (!name) return fail("용병 이름을 입력하세요.");

  const explicitNumber = numberText ? Number(numberText) : null;
  if (explicitNumber !== null && (!Number.isInteger(explicitNumber) || explicitNumber < 0)) {
    return fail("용병 등번호는 0 이상이어야 합니다.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("match_roster").insert({
    match_id: matchId,
    player_id: null,
    guest_name: name,
    guest_number: explicitNumber,
  });

  if (error) return fail(error.message);

  revalidatePath("/lineup");
  revalidatePath(`/seasons/${seasonId}/matches/${matchId}`);
  revalidatePath(`/seasons/${seasonId}/matches/${matchId}/lineup`);
  revalidatePath(`/seasons/${seasonId}/matches/${matchId}/stats`);
  return { ok: true, message: `용병을 이 경기 명단에 추가했습니다: ${explicitNumber === null ? "" : `#${explicitNumber} `}${name}` };
}

async function refreshPositionPerformance(seasonId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("period_lineups")
    .select("player_id, position_slots(position_code), periods!inner(id, matches!inner(id, season_id))")
    .not("player_id", "is", null)
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
    .select("*, players(*), match_roster(*), position_slots(*)")
    .eq("period_id", periodId);
}
