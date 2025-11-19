"use client";

import { useActionState } from "react";
import { signUpAction, type FormState } from "@/lib/supabase/actions";

const initialState: FormState = { status: "idle", message: "" };

export function RegisterForm() {
  const [state, action, pending] = useActionState(signUpAction, initialState);

  return (
    <form
      action={action}
      className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Sign Up
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">建立新帳號</h1>
        <p className="text-sm text-slate-500">
          註冊後請前往信箱完成驗證流程。
        </p>
      </div>
      <label className="block text-sm font-medium text-slate-700">
        姓名
        <input
          type="text"
          name="fullName"
          className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
          placeholder="王小明"
          required
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        公司 Email
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
          placeholder="至少 6 碼"
          required
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        常駐分店（選填）
        <input
          type="text"
          name="branch"
          className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
          placeholder="台北旗艦店"
        />
      </label>
      <button
        className="w-full rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={pending}
      >
        {pending ? "註冊中..." : "註冊"}
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
