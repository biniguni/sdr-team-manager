"use server";

import { revalidatePath } from "next/cache";
import { requireMatchResultManager } from "@/lib/authz";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function integer(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : Number.NaN;
}

function fail(message: string): ActionResult {
  return { ok: false, message };
}

export async function savePlayerMatchStats(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const resultManager = await requireMatchResultManager();
  if (!resultManager.ok) return fail(resultManager.message);

  const matchId = text(formData, "match_id");
  const seasonId = text(formData, "season_id");
  const playerId = text(formData, "player_id");

  if (!matchId || !seasonId || !playerId) return fail("Match or player context is missing.");

  const goals = integer(formData, "goals");
  const assists = integer(formData, "assists");
  const yellowCards = integer(formData, "yellow_cards");
  const redCards = integer(formData, "red_cards");

  if ([goals, assists, yellowCards, redCards].some((value) => !Number.isInteger(value) || value < 0)) {
    return fail("득점, 도움, 경고, 퇴장은 0 이상이어야 합니다.");
  }

  const supabase = await createClient();
  const [{ data: player, error: playerError }, { data: assigned, error: assignedError }] = await Promise.all([
    supabase.from("players").select("player_type").eq("id", playerId).maybeSingle(),
    supabase
      .from("period_lineups")
      .select("id, periods!inner(match_id)")
      .eq("player_id", playerId)
      .eq("periods.match_id", matchId)
      .limit(1),
  ]);

  if (playerError) return fail(playerError.message);
  if (assignedError) return fail(assignedError.message);
  if (player?.player_type !== "member") {
    return fail("등록 선수만 경기 기록을 저장할 수 있습니다.");
  }

  if (!assigned || assigned.length === 0) {
    return fail("Only players assigned to this match lineup can receive match stats.");
  }

  const { error } = await supabase.from("player_match_stats").upsert(
    {
      match_id: matchId,
      player_id: playerId,
      played: formData.get("played") === "on",
      goals,
      assists,
      yellow_cards: yellowCards,
      red_cards: redCards,
    },
    { onConflict: "match_id,player_id" },
  );

  if (error) return fail(error.message);

  revalidatePath(`/seasons/${seasonId}/matches/${matchId}/stats`);
  return { ok: true, message: "선수 기록을 저장했습니다." };
}

export async function getMatchStats(matchId: string) {
  const supabase = await createClient();
  return supabase.from("player_match_stats").select("*").eq("match_id", matchId);
}
