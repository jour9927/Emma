"use client";

import { useActionState } from "react";
import { createSupportRequestAction } from "@/lib/supabase/actions";
import type { Branch } from "@/lib/types";

const initialState = { status: "idle", message: "" };

interface SupportRequestFormProps {
  branches: Branch[];
}

export function SupportRequestForm({ branches }: SupportRequestFormProps) {
  const [state, formAction, pending] = useActionState(
    createSupportRequestAction,
    initialState,
  );

  return (
    <form
      id="support-request"
      action={formAction}
      className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm"
    >
      <div>
        <p className="text-sm font-semibold text-slate-900">新增支援需求</p>
        <p className="text-xs text-slate-500">
          系統會即時通知可支援的分店
        </p>
      </div>
      <label className="text-xs font-semibold text-slate-600">
        分店
        <select
          name="branchId"
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          required
        >
          <option value="">請選擇</option>
          {branches.map((branch) => (
            <option value={branch.id} key={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs font-semibold text-slate-600">
        優先度
        <select
          name="priority"
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>
      </label>
      <label className="text-xs font-semibold text-slate-600">
        申請人
        <input
          type="text"
          name="requested_by"
          placeholder="例如：高雄店長 Hans"
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          required
        />
      </label>
      <label className="text-xs font-semibold text-slate-600">
        需求內容
        <textarea
          name="message"
          placeholder="請描述所需人數、時段與技能"
          className="mt-1 h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          required
        />
      </label>
      <button
        className="w-full rounded-xl bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={pending}
      >
        {pending ? "送出中..." : "送出支援需求"}
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
