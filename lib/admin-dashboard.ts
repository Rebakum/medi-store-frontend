// lib/types/admin-dashboard.ts
export type AdminStats = {
  users: { total: number; new7d: number };
  orders: { today: number; pending: number; processing: number };
  medicines: { active: number; lowStock: number; lowStockThreshold: number };
  revenue: { today: number; thisMonth: number; changePct: number };
};

export type ChartPoint = {
  // recommended
  iso?: string; // "2026-02-01"
  date: string; // label e.g. "Feb 1"
  orders: number;
  revenue: number;
};

export type AdminDashboardResponse = {
  stats: AdminStats;
  charts: {
    last7d: ChartPoint[];
    last30d: ChartPoint[];
    last3m: ChartPoint[];
    // optional: backend দিলে
    febToDate?: ChartPoint[];
  };
};
