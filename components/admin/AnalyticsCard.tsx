"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ChartPoint } from "@/lib/admin-dashboard";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Range = "feb" | "last7d" | "last30d" | "last3m";

export default function AnalyticsCard({
  charts,
  loading,
}: {
  charts: {
    last7d: ChartPoint[];
    last30d: ChartPoint[];
    last3m: ChartPoint[];
    febToDate?: ChartPoint[];
  } | null;
  loading: boolean;
}) {
  const [range, setRange] = useState<Range>("feb");

  const febFiltered = useMemo(() => {
    // 1) backend gives ready febToDate => use it
    if (charts?.febToDate?.length) return charts.febToDate;

    // 2) else: filter from last3m by iso date if available
    const base = charts?.last3m ?? makeFakeChart().last3m;
    const year = new Date().getFullYear();
    const feb1 = `${year}-02-01`;

    // only works properly if iso exists
    const withIso = base.filter((p) => p.iso && p.iso >= feb1);
    if (withIso.length) return withIso;

    // 3) fallback: show last30d if no iso
    return charts?.last30d ?? makeFakeChart().last30d;
  }, [charts]);

  const data = useMemo(() => {
    const fallback = makeFakeChart();
    if (!charts) {
      if (range === "feb") return fallback.last30d; // Feb fallback
      return fallback[range === "last7d" ? "last7d" : range === "last30d" ? "last30d" : "last3m"];
    }

    if (range === "feb") return febFiltered;
    if (range === "last7d") return charts.last7d;
    if (range === "last30d") return charts.last30d;
    return charts.last3m;
  }, [charts, range, febFiltered]);

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Analytics</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Orders trend (you can switch to revenue easily)
            </p>
          </div>

          <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
            <TabsList className="rounded-xl">
              <TabsTrigger className="rounded-lg" value="feb">Feb (to date)</TabsTrigger>
              <TabsTrigger className="rounded-lg" value="last7d">Last 7d</TabsTrigger>
              <TabsTrigger className="rounded-lg" value="last30d">Last 30d</TabsTrigger>
              <TabsTrigger className="rounded-lg" value="last3m">Last 3m</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="currentColor" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="currentColor" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} strokeOpacity={0.2} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} minTickGap={20} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 12 }} />

              <Area type="monotone" dataKey="orders" stroke="currentColor" fill="url(#ordersFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {!loading && !charts ? (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Showing fallback chart. For real chart, use backend: <b>/admin/dashboard</b> with charts.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

/* fallback data */
function makeFakeChart() {
  const mk = (days: number) =>
    Array.from({ length: days }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const iso = d.toISOString().slice(0, 10);
      const orders = 5 + Math.round(Math.sin(i / 3) * 4) + Math.round(Math.random() * 5);
      const revenue = orders * (300 + Math.round(Math.random() * 800));
      return {
        iso,
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        orders,
        revenue,
      };
    });

  return {
    last3m: mk(90),
    last30d: mk(30),
    last7d: mk(7),
  };
}
