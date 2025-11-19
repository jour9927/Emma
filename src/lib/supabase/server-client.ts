"use server";

import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return null;
  }
  return { url, anonKey };
}

export async function createSupabaseServerClient(): Promise<
  SupabaseClient | null
> {
  const env = getEnv();
  if (!env) return null;

  const nextCookies: ReadonlyRequestCookies = cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      get(name: string) {
        return nextCookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        nextCookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        nextCookies.set({ name, value: "", ...options });
      },
    },
  });
}
