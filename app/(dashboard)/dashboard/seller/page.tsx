"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import RoleGuard from "@/components/common/role-guard";
import { apiJson as api } from "@/lib/api";

// shadcn
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SellerStats } from "@/lib/types";

/* ---------------- helpers ---------------- */

const money = (n: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(n || 0);

const fmtDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

// ✅ build proper image url for /uploads/... or relative paths
function buildAssetUrl(raw?: string | null) {
  if (!raw) return "";
  const v = raw.trim();
  if (!v) return "";
  if (v.startsWith("http")) return v;

  const base =
    process.env.NEXT_PUBLIC_ASSET_BASE_URL ||
    (process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ?? "");

  const b = base.replace(/\/+$/, "");
  const p = v.replace(/^\/+/, "");
  return b ? `${b}/${p}` : `/${p}`;
}

const statusBadge = (s: string) => {
  const base = "rounded-xl";
  switch (s) {
    case "PLACED":
      return (
        <Badge className={base} variant="secondary">
          PLACED
        </Badge>
      );
    case "PROCESSING":
      return (
        <Badge className={base} variant="outline">
          PROCESSING
        </Badge>
      );
    case "SHIPPED":
      return (
        <Badge className={base} variant="outline">
          SHIPPED
        </Badge>
      );
    case "DELIVERED":
      return (
        <Badge className={base} variant="secondary">
          DELIVERED
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge className={base} variant="destructive">
          CANCELLED
        </Badge>
      );
    default:
      return (
        <Badge className={base} variant="outline">
          {s}
        </Badge>
      );
  }
};

const Avatar = ({
  src,
  alt,
  size = 40,
}: {
  src?: string | null;
  alt: string;
  size?: number;
}) => {
  const s = size;
  const finalSrc = buildAssetUrl(src) || "/avatar.png";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={finalSrc}
      alt={alt}
      width={s}
      height={s}
      className="object-cover rounded-full shrink-0"
      style={{ width: s, height: s }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/avatar.png";
      }}
    />
  );
};

const Thumb = ({
  src,
  alt,
  size = 36,
}: {
  src?: string | null;
  alt: string;
  size?: number;
}) => {
  const s = size;
  const finalSrc = buildAssetUrl(src) || "/placeholder.png";

  return (
    <div
      className="overflow-hidden border rounded-lg bg-muted shrink-0"
      style={{ width: s, height: s }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={finalSrc}
        alt={alt}
        width={s}
        height={s}
        className="object-cover w-full h-full"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
        }}
      />
    </div>
  );
};

export default function SellerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SellerStats | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api<{ data: SellerStats }>("/seller/stats");
      setData(res.data);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load seller dashboard");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const pills = useMemo(() => {
    const low = data?.medicines.lowStock ?? 0;
    return {
      lowStockTone:
        low > 0
          ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-500/30"
          : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-500/30",
    };
  }, [data?.medicines.lowStock]);

  const revenueToday = data?.revenue?.today ?? 0;
  const revenueMonth = data?.revenue?.month ?? 0;

  return (
    <RoleGuard allow={["SELLER"]}>
      <div className="p-4 space-y-6 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Seller Dashboard
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Your store overview (medicines, orders, revenue & reviews)
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              className="rounded-xl px-3 py-2 text-sm font-semibold text-white bg-[#2EB0D9] hover:bg-[#38CAE4] active:scale-[0.98] transition shadow-sm"
            >
              <Link href="/dashboard/seller/medicines/new">Add Medicine</Link>
            </Button>

            <Button
              onClick={load}
              disabled={loading}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-white bg-[#2EB0D9] hover:bg-[#38CAE4] active:scale-[0.98] transition shadow-sm"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid items-stretch grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-4">
          <KpiCard
            title="My Active Medicines"
            value={loading ? "—" : String(data?.medicines.active ?? 0)}
            pill="Active"
            subTitle="Manage medicines"
            subNote="Open your medicines list"
            href="/dashboard/seller/medicines"
          />

          <KpiCard
            title="Low Stock"
            value={loading ? "—" : String(data?.medicines.lowStock ?? 0)}
            pill={`≤ ${data?.medicines.lowStockThreshold ?? 5}`}
            pillClassName={pills.lowStockTone}
            subTitle="Restock alert"
            subNote="View low stock medicines"
            href="/dashboard/seller/medicines"
          />

          {/*  Revenue Today pill bg changed */}
          <KpiCard
            title="Revenue Today"
            value={loading ? "—" : money(revenueToday)}
            pill="BDT"
            pillClassName="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:border-sky-500/30"
            subTitle="Today sales"
            subNote="Earnings from your items today"
            href="/dashboard/seller/orders"
          />

          {/*  Revenue Month pill bg changed */}
          <KpiCard
            title="Revenue This Month"
            value={loading ? "—" : money(revenueMonth)}
            pill="Month"
            pillClassName="bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-200 dark:border-violet-500/30"
            subTitle="Monthly revenue"
            subNote="Current month earnings"
            href="/dashboard/seller/orders"
          />
        </div>

        {/* Lists */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">Recent Orders</CardTitle>
                <Button asChild size="sm" variant="secondary" className="rounded-xl">
                  <Link href="/dashboard/seller/orders">View all</Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <Separator className="mb-4" />

              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : !data?.recentOrders?.length ? (
                <EmptyState
                  title="No orders yet"
                  note="When customers order your medicines, they will appear here."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentOrders.map((o) => (
                      <TableRow
                        key={o.id}
                        className="transition hover:bg-sky-50/60 dark:hover:bg-white/5"
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">#{o.id.slice(0, 8)}</div>
                            <div className="text-xs text-muted-foreground">
                              {o.customer?.name || o.customer?.email || "Customer"} •{" "}
                              {fmtDate(o.createdAt)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{statusBadge(o.status)}</TableCell>
                        <TableCell className="font-medium text-right">{money(o.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">Recent Reviews</CardTitle>
                <Button asChild size="sm" variant="secondary" className="rounded-xl">
                  <Link href="/dashboard/seller/reviews">View all</Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <Separator className="mb-4" />

              {loading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : !data?.recentReviews?.length ? (
                <EmptyState
                  title="No reviews yet"
                  note="When customers review your medicines, they will appear here."
                />
              ) : (
                <div className="space-y-3">
                  {data.recentReviews.map((r) => {
                    const customerImg =
                      (r as any)?.customer?.image ||
                      (r as any)?.customer?.avatar ||
                      (r as any)?.customer?.avatarUrl ||
                      "";

                    const medImg =
                      (r as any)?.medicine?.images?.[0] ||
                      (r as any)?.medicine?.image ||
                      "";

                    const medName = (r as any)?.medicine?.name || "Medicine";

                    return (
                      <div
                        key={r.id}
                        className="flex gap-3 p-3 transition border rounded-xl bg-background hover:bg-sky-50/60 hover:border-sky-200 dark:hover:bg-white/5 dark:hover:border-white/10"
                      >
                        <Avatar src={customerImg} alt={(r as any)?.customer?.name || "Customer"} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">
                                {(r as any)?.customer?.name ||
                                  (r as any)?.customer?.email ||
                                  "Customer"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {fmtDate(r.createdAt)}
                              </div>
                            </div>

                            <RatingBadge rating={(r as any)?.rating ?? 0} />
                          </div>

                          <div className="mt-2 text-sm text-slate-700 dark:text-slate-200 line-clamp-2">
                            (r as any)?.comment?.trim()
                              ? (r as any).comment
                              : "No comment"
                          </div>

                          <div className="flex items-center gap-2 mt-3">
                            <Thumb src={medImg} alt={medName} size={36} />
                            <div className="text-xs truncate text-muted-foreground">
                              {medName}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Low stock list */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">Low Stock Medicines</CardTitle>
              <Button asChild size="sm" variant="secondary" className="rounded-xl">
                <Link href="/dashboard/seller/medicines">Manage</Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <Separator className="mb-4" />

            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : !data?.lowStockMedicines?.length ? (
              <EmptyState
                title="No low stock medicines"
                note="You're good — stock levels look healthy."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.lowStockMedicines.map((m) => (
                    <TableRow
                      key={m.id}
                      className="transition hover:bg-sky-50/60 dark:hover:bg-white/5"
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{m.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {m.price ? money(m.price) : ""}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="rounded-xl" variant="outline">
                          {m.status || "ACTIVE"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-right">{m.stock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}

/* ---------------- Components ---------------- */

function KpiCard({
  title,
  value,
  pill,
  subTitle,
  subNote,
  href,
  pillClassName,
}: {
  title: string;
  value: string;
  pill: string;
  subTitle: string;
  subNote: string;
  href: string;
  pillClassName?: string;
}) {
  return (
    <Link href={href} className="block h-full">
      {/* ✅ hover bg changed here */}
      <Card className="h-full transition rounded-2xl hover:shadow-md hover:bg-sky-50/60 dark:hover:bg-white/5">
        <CardContent className="p-5 h-[220px] flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm text-slate-600 dark:text-slate-300">{title}</div>

            <span
              className={[
                "px-2.5 py-1 text-xs rounded-xl border whitespace-nowrap",
                pillClassName ??
                  "bg-slate-50 text-slate-700 border-slate-200 dark:bg-white/5 dark:text-slate-200 dark:border-white/10",
              ].join(" ")}
            >
              {pill}
            </span>
          </div>

          <div className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {value}
          </div>

          <div className="pt-5 mt-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              <span className="truncate">{subTitle}</span>
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs text-white rounded-md bg-[#2EB0D9]">
                ↗
              </span>
            </div>

            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {subNote}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function RatingBadge({ rating }: { rating: number }) {
  const tone =
    rating >= 4
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-500/30"
      : rating >= 3
      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-500/30"
      : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-200 dark:border-rose-500/30";

  return <span className={`px-2.5 py-1 text-xs rounded-xl border ${tone}`}>⭐ {rating}</span>;
}

function EmptyState({ title, note }: { title: string; note: string }) {
  return (
    <div className="p-6 border rounded-xl bg-muted/30">
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{note}</div>
    </div>
  );
}
