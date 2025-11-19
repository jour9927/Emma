"use client";

import { useActionState } from "react";
import { createBranchAction } from "@/lib/supabase/actions";

const initialState = { status: "idle", message: "" };

export function CreateBranchForm() {
  const [state, action, pending] = useActionState(
    createBranchAction,
    initialState,
  );

  return (
    <form
      action={action}
      className="space-y-3 rounded-2xl border border-dashed border-slate-200 bg-white/50 p-4"
    >
      <div>
        <p className="text-sm font-semibold text-slate-900">新增分店</p>
        <p className="text-xs text-slate-500">
          將自動出現在 Dashboard 中
        </p>
      </div>
      <label className="text-xs font-semibold text-slate-600">
        分店名稱
        <input
          type="text"
          name="name"
          required
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <label className="text-xs font-semibold text-slate-600">
        地點
        <input
          type="text"
          name="location"
          required
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <label className="text-xs font-semibold text-slate-600">
        需求人數
        <input
          type="number"
          name="required_headcount"
          required
          placeholder="例如 15"
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <label className="text-xs font-semibold text-slate-600">
        聯絡人
        <input
          type="text"
          name="lead_contact"
          placeholder="分店負責人"
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <button
        className="w-full rounded-xl bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={pending}
      >
        {pending ? "建立中..." : "新增分店"}
      </button>
      {state.message && (
        <p
          className={`text-xs ${
            state.status === "error" ? "text-rose-600" : "text-emerald-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
