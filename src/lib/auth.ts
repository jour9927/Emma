import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./supabase/server-client";

export async function loadCurrentUser(): Promise<User | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ?? null;
}
