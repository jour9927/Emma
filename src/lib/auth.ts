import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./supabase/server-client";

export async function loadCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ?? null;
}

export function isAdmin(user: User | null | undefined): boolean {
  return (user?.user_metadata?.role as string | undefined) === "admin";
}
