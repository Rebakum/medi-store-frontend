"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AdminStats } from "@/lib/admin-dashboard";

const money = (n: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(n);

export default function KpiGrid({ stats, loading }: { stats: AdminStats | null; loading: boolean }) {
  const pct = stats?.revenue.changePct ?? 0;
  const trend = pct > 0 ? `+${pct}%` : pct < 0 ? `${pct}%` : "0%";

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        title="Total Revenue"
        value={loading ? "—" : money(stats?.revenue.thisMonth ?? 0)}
        pill={loading ? "—" : trend}
        subTitle={loading ? "Loading..." : "Trending this month"}
        subNote="Revenue for the current month"
        href="/dashboard/admin/orders"
      />

      <KpiCard
        title="Users"
        value={loading ? "—" : String(stats?.users.total ?? 0)}
        pill={loading ? "—" : `+${stats?.users.new7d ?? 0} / 7d`}
        subTitle={loading ? "Loading..." : "New users"}
        subNote="New users in last 7 days"
        href="/dashboard/admin/users"
      />

      <KpiCard
        title="Medicines"
        value={loading ? "—" : String(stats?.medicines.active ?? 0)}
        pill={loading ? "—" : `Low: ${stats?.medicines.lowStock ?? 0}`}
        subTitle={loading ? "Loading..." : "Stock summary"}
        subNote={`Low stock threshold ≤ ${stats?.medicines.lowStockThreshold ?? 5}`}
        href="/dashboard/admin/medicines"
      />

      <KpiCard
        title="Orders Today"
        value={loading ? "—" : String(stats?.orders.today ?? 0)}
        pill={loading ? "—" : `Pending: ${stats?.orders.pending ?? 0}`}
        subTitle={loading ? "Loading..." : "Order flow"}
        subNote={`Processing: ${stats?.orders.processing ?? 0}`}
        href="/dashboard/admin/orders"
      />
    </div>
  );
}

function KpiCard({
  title,
  value,
  pill,
  subTitle,
  subNote,
  href,
}: {
  title: string;
  value: string;
  pill: string;
  subTitle: string;
  subNote: string;
  href: string;
}) {
  return (
    <Link href={href} className="block h-full">
      <Card className="h-full transition rounded-2xl hover:shadow-sm">
      
        <CardContent className="p-5 h-[220px] flex flex-col">
          {/* top */}
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm text-slate-600 dark:text-slate-300">{title}</div>
            <Badge variant="outline" className="rounded-xl whitespace-nowrap">
              {pill}
            </Badge>
          </div>

          {/* value */}
          <div className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {value}
          </div>

          {/*push bottom content to bottom always */}
          <div className="pt-5 mt-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              <span className="truncate">{subTitle}</span>

              {/* small square icon */}
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs text-white rounded-md">
                ↗
              </span>
            </div>

            {/* clamp lines so every card same */}
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {subNote}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

