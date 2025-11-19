export type StaffingStatus = "stable" | "warning" | "critical";

export interface Branch {
  id: string;
  name: string;
  location: string;
  required_headcount: number;
  current_headcount: number;
  lead_contact?: string | null;
  notes?: string | null;
  updated_at?: string | null;
}

export interface CoverageRequest {
  id: string;
  branch_id: string;
  priority: "low" | "medium" | "high";
  status: "open" | "committed" | "closed";
  requested_by: string;
  message: string;
  created_at: string;
}

export interface AdminSnapshot {
  totalBranches: number;
  openRequests: number;
  coverageCommitted: number;
  criticalBranches: number;
}
