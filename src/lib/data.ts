import { createSupabaseServerClient } from "./supabase/server-client";
import {
  AdminSnapshot,
  Branch,
  CoverageRequest,
  StaffingStatus,
} from "./types";
import { demoBranches, demoRequests, demoSnapshot } from "./demo-data";

export async function loadBranches(): Promise<Branch[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return demoBranches;
  }

  const { data, error } = await supabase
    .from("branches")
    .select(
      "id,name,location,required_headcount,current_headcount,lead_contact,notes,updated_at",
    )
    .order("name");

  if (error || !data) {
    return demoBranches;
  }
  return data as Branch[];
}

export async function loadRequests(): Promise<CoverageRequest[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return demoRequests;
  }

  const { data, error } = await supabase
    .from("coverage_requests")
    .select(
      "id,branch_id,priority,status,requested_by,message,created_at",
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    return demoRequests;
  }
  return data as CoverageRequest[];
}

export function getStaffingStatus(branch: Branch): StaffingStatus {
  const ratio = branch.current_headcount / branch.required_headcount;
  if (ratio >= 0.9) return "stable";
  if (ratio >= 0.7) return "warning";
  return "critical";
}

export function buildSnapshot(
  branches: Branch[],
  requests: CoverageRequest[],
): AdminSnapshot {
  if (!branches.length && !requests.length) {
    return demoSnapshot;
  }

  return {
    totalBranches: branches.length,
    openRequests: requests.filter((req) => req.status === "open").length,
    coverageCommitted: requests.filter(
      (req) => req.status === "committed",
    ).length,
    criticalBranches: branches.filter(
      (branch) => getStaffingStatus(branch) === "critical",
    ).length,
  };
}
