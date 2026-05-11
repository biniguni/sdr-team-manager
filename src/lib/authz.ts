import { createClient } from "@/lib/supabase/server";

export async function getAuthStatus() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, canEdit: false };
  }

  const { data } = await supabase
    .from("team_editors")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return { user, canEdit: Boolean(data) };
}
