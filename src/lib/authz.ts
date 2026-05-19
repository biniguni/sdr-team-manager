import { createClient } from "@/lib/supabase/server";

export async function getAuthStatus() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, canEdit: false, canManageMatchResults: false };
  }

  const { data } = await supabase
    .from("team_editors")
    .select("user_id, can_manage_match_results")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    user,
    canEdit: Boolean(data),
    canManageMatchResults: Boolean(data?.can_manage_match_results),
  };
}

export async function requireEditor() {
  const status = await getAuthStatus();
  if (!status.canEdit) {
    return { ok: false as const, message: "Approved editor access is required." };
  }
  return { ok: true as const, ...status };
}

export async function requireMatchResultManager() {
  const status = await getAuthStatus();
  if (!status.canEdit) {
    return { ok: false as const, message: "Approved editor access is required." };
  }
  if (!status.canManageMatchResults) {
    return { ok: false as const, message: "Match result permission is required." };
  }
  return { ok: true as const, ...status };
}
