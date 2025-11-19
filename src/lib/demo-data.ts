import { AdminSnapshot, Branch, CoverageRequest } from "./types";

export const demoBranches: Branch[] = [
  {
    id: "north-001",
    name: "北區旗艦店",
    location: "台北市信義區",
    required_headcount: 18,
    current_headcount: 12,
    lead_contact: "Vicky 0922-000-123",
    notes: "下午茶時段需求特別高",
  },
  {
    id: "west-002",
    name: "桃園高鐵店",
    location: "桃園市中壢區",
    required_headcount: 14,
    current_headcount: 10,
    lead_contact: "Frank 0935-218-556",
  },
  {
    id: "central-003",
    name: "台中公益店",
    location: "台中市南屯區",
    required_headcount: 12,
    current_headcount: 12,
    lead_contact: "Sunny 0977-662-330",
  },
  {
    id: "south-004",
    name: "高雄漢神巨蛋店",
    location: "高雄市鼓山區",
    required_headcount: 16,
    current_headcount: 8,
    lead_contact: "Hans 0918-845-280",
    notes: "早班缺人，急需調度",
  },
];

export const demoRequests: CoverageRequest[] = [
  {
    id: "req-1",
    branch_id: "south-004",
    priority: "high",
    status: "open",
    requested_by: "Hans",
    message: "早班需要 3 位資深飲料手",
    created_at: new Date().toISOString(),
  },
  {
    id: "req-2",
    branch_id: "north-001",
    priority: "medium",
    status: "committed",
    requested_by: "Vicky",
    message: "櫃台人力不足，已調度 2 人",
    created_at: new Date().toISOString(),
  },
];

export const demoSnapshot: AdminSnapshot = {
  totalBranches: demoBranches.length,
  openRequests: demoRequests.filter((req) => req.status === "open").length,
  coverageCommitted: demoRequests.filter((req) => req.status === "committed")
    .length,
  criticalBranches: demoBranches.filter(
    (branch) => branch.current_headcount / branch.required_headcount < 0.7,
  ).length,
};
