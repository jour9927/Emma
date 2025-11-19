"use client";

import { useActionState } from "react";
import { resolveRequestAction } from "@/lib/supabase/actions";
import type { CoverageRequest } from "@/lib/types";

const initialState = { status: "idle", message: "" };

interface RequestStatusFormProps {
  request: CoverageRequest;
}

export function RequestStatusForm({ request }: RequestStatusFormProps) {
  const [state, action, pending] = useActionState(
    resolveRequestAction,
    initialState,
  );

  return (
    <form action={action} className="space-y-2 rounded-2xl bg-slate-50 p-3">
      <input type="hidden" name="requestId" value={request.id} />
      <label className="text-xs font-semibold text-slate-600">
        更新狀態
        <select
          name="status"
          defaultValue={request.status}
          className="mt-1 w-full rounded-xl border border-slate-200 px-2 py-1.5 text-sm"
        >
          <option value="open">未派遣</option>
          <option value="committed">已派遣</option>
          <option value="closed">已結案</option>
        </select>
      </label>
      <button
        className="w-full rounded-xl bg-white py-1.5 text-xs font-semibold text-slate-900 shadow-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-200"
        disabled={pending}
      >
        {pending ? "更新中..." : "儲存"}
      </button>
      {state.message && (
        <p
          className={`text-[11px] ${
            state.status === "error" ? "text-rose-600" : "text-emerald-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
