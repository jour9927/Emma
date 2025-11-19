"use client";

import { useActionState } from "react";
import { signInAction, type FormState } from "@/lib/supabase/actions";

const initialState: FormState = { status: "idle", message: "" };

export function LoginForm() {
  const [state, action, pending] = useActionState(signInAction, initialState);

  return (
    <form
      action={action}
      className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Sign In
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">登入帳號</h1>
        <p className="text-sm text-slate-500">
          使用公司 Email 與密碼登入系統。
        </p>
      </div>
      <label className="block text-sm font-medium text-slate-700">
        Email
        <input
          type="email"
          name="email"
          className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
          placeholder="you@company.com"
          required
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        密碼
        <input
          type="password"
          name="password"
          className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
          placeholder="********"
          required
        />
      </label>
      <button
        className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={pending}
      >
        {pending ? "登入中..." : "登入"}
      </button>
      {state.message && (
        <p
          className={`text-sm ${
            state.status === "error" ? "text-rose-600" : "text-emerald-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
