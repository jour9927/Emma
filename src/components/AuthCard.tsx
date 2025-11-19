"use client";

import { useActionState } from "react";
import {
  signInAction,
  signOutAction,
  signUpAction,
  type FormState,
} from "@/lib/supabase/actions";

const initialState: FormState = { status: "idle", message: "" };

interface AuthCardProps {
  userEmail?: string | null;
}

export function AuthCard({ userEmail }: AuthCardProps) {
  const [loginState, loginAction, loginPending] = useActionState(
    signInAction,
    initialState,
  );
  const [registerState, registerAction, registerPending] = useActionState(
    signUpAction,
    initialState,
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            員工入口
          </p>
          <h3 className="text-lg font-semibold text-slate-900">
            註冊 / 登入
          </h3>
        </div>
        {userEmail ? (
          <span className="text-xs text-emerald-600">已登入</span>
        ) : (
          <span className="text-xs text-slate-500">尚未登入</span>
        )}
      </div>
      <div className="mt-4 space-y-4">
        <form action={loginAction} className="space-y-3">
          <input
            type="email"
            name="email"
            required
            placeholder="公司 Email"
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
          <input
            type="password"
            name="password"
            required
            placeholder="密碼"
            className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
          <button
            className="w-full rounded-2xl bg-indigo-600 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={loginPending}
          >
            {loginPending ? "登入中..." : "登入"}
          </button>
          {loginState.message && (
            <p
              className={`text-xs ${
                loginState.status === "error" ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              {loginState.message}
            </p>
          )}
        </form>

        <div className="rounded-2xl border border-dashed border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-500">還沒有帳號？</p>
          <form action={registerAction} className="mt-2 space-y-2">
            <input
              type="text"
              name="fullName"
              placeholder="姓名"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <input
              type="email"
              name="email"
              placeholder="公司 Email"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <input
              type="password"
              name="password"
              placeholder="設定密碼 (至少 6 碼)"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              name="branch"
              placeholder="常駐分店 (選填)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <button
              className="w-full rounded-xl bg-slate-900 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={registerPending}
            >
              {registerPending ? "送出中..." : "註冊新帳號"}
            </button>
            {registerState.message && (
              <p
                className={`text-xs ${
                  registerState.status === "error"
                    ? "text-rose-600"
                    : "text-emerald-600"
                }`}
              >
                {registerState.message}
              </p>
            )}
          </form>
        </div>
      </div>

      {userEmail && (
        <form action={signOutAction} className="mt-4 text-right">
          <button className="text-xs font-medium text-rose-500 hover:text-rose-600">
            登出 {userEmail}
          </button>
        </form>
      )}
    </section>
  );
}
