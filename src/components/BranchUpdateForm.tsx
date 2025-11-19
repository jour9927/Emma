"use client";

import { useActionState } from "react";
import type { Branch } from "@/lib/types";
import {
  updateBranchStaffingAction,
  type FormState,
} from "@/lib/supabase/actions";

const initialState: FormState = { status: "idle", message: "" };

interface BranchUpdateFormProps {
  branch: Branch;
}

export function BranchUpdateForm({ branch }: BranchUpdateFormProps) {
  const [state, action, pending] = useActionState(
    updateBranchStaffingAction,
    initialState,
  );

  return (
    <form action={action} className="space-y-3 rounded-2xl bg-slate-50 p-4">
      <input type="hidden" name="branchId" value={branch.id} />
      <div className="grid grid-cols-2 gap-3 text-sm">
        <label className="space-y-1 text-slate-600">
          必須人數
          <input
            type="number"
            name="required_headcount"
            defaultValue={branch.required_headcount}
            className="w-full rounded-xl border border-slate-200 px-2 py-1.5"
          />
        </label>
        <label className="space-y-1 text-slate-600">
          現場人數
          <input
            type="number"
            name="current_headcount"
            defaultValue={branch.current_headcount}
            className="w-full rounded-xl border border-slate-200 px-2 py-1.5"
          />
        </label>
      </div>
      <label className="space-y-1 text-sm text-slate-600">
        備註
        <textarea
          name="notes"
          defaultValue={branch.notes ?? ""}
          className="h-20 w-full rounded-xl border border-slate-200 px-2 py-1.5 text-sm"
        />
      </label>
      <button
        className="w-full rounded-xl bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={pending}
      >
        {pending ? "更新中..." : "更新分店"}
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
