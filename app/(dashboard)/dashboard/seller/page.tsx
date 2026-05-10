"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import RoleGuard from "@/components/common/role-guard";
import { apiJson as api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus, Package, AlertTriangle, TrendingUp, DollarSign, ShoppingCart, Star, Clock } from "lucide-react";
import { SellerStats } from "@/lib/types";

const money = (n: number) => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(n || 0);

const fmtDate = (iso: string) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const StatCard = ({ title, value, subtitle, icon: Icon, gradient, alert }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  gradient: string;
  alert?: boolean;
}) => (
  <div className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border ${alert ? "border-amber-200 dark:border-amber-800" : "border-slate-200 dark:border-slate-800"} p-6 hover:shadow-lg transition-all duration-300`}>
    {alert && <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center animate-pulse"><AlertTriangle className="w-4 h-4 text-white" /></div>}
    <div className={`absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-3xl`} />
    <div className="relative flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const SectionCard = ({ title, children, action, icon: Icon }: { title: string; children: React.ReactNode; action?: React.ReactNode; icon?: any }) => (
  <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
      <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
        {Icon && <Icon className="w-5 h-5 text-cyan-500" />}
        {title}
      </h3>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    PLACED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    PROCESSING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    SHIPPED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    DELIVERED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  };
  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status] || "bg-slate-100 text-slate-600"}`}>{status}</span>;
};

const RatingStars = ({ rating }: { rating: number }) => (
  <span className="flex items-center gap-0.5 px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">
    {"★".repeat(rating)}{"☆".repeat(5 - rating)}
  </span>
);

export default function SellerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SellerStats | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<{ data: SellerStats }>("/seller/stats");
      setData(res.data);
      setLastUpdate(new Date());
    } catch (e: any) {
      toast.error(e?.message || "Failed to load seller dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <RoleGuard allow={["SELLER"]}>
      <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Seller Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">{lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : "Loading..."}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button asChild className="gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:shadow-lg">
              <Link href="/dashboard/seller/medicines/new">
                <Plus className="w-4 h-4" />
                Add Medicine
              </Link>
            </Button>
            <Button onClick={load} disabled={loading} variant="outline" className="gap-2 rounded-xl">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Medicines"
            value={data?.medicines.active ?? "—"}
            subtitle="Your total products"
            icon={Package}
            gradient="from-cyan-500 to-teal-500"
          />
          <StatCard
            title="Low Stock"
            value={data?.medicines.lowStock ?? "—"}
            subtitle={`Threshold: ${data?.medicines.lowStockThreshold ?? 5}`}
            icon={AlertTriangle}
            gradient="from-amber-500 to-orange-500"
            alert={(data?.medicines.lowStock ?? 0) > 0}
          />
          <StatCard
            title="Revenue Today"
            value={money(data?.revenue?.today ?? 0)}
            subtitle="Today's earnings"
            icon={DollarSign}
            gradient="from-emerald-500 to-green-500"
          />
          <StatCard
            title="This Month"
            value={money(data?.revenue?.month ?? 0)}
            subtitle="Monthly earnings"
            icon={TrendingUp}
            gradient="from-purple-500 to-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="Recent Orders" icon={ShoppingCart} action={<Button asChild size="sm" variant="ghost" className="rounded-xl"><Link href="/dashboard/seller/orders">View All</Link></Button>}>
            {!loading && (!data?.recentOrders?.length ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-600">No orders yet</p>
                <p className="text-xs text-slate-400 mt-1">Orders will appear here when customers purchase</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data?.recentOrders?.slice(0, 5).map((order) => (
                  <Link key={order.id} href={`/dashboard/seller/orders/${order.id}`} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold">
                        #{order.id.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">#{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-slate-500">{order.customer?.name || order.customer?.email || "Customer"} • {fmtDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} />
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{money(order.total)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </SectionCard>

          <SectionCard title="Recent Reviews" icon={Star} action={<Button asChild size="sm" variant="ghost" className="rounded-xl"><Link href="/dashboard/seller/reviews">View All</Link></Button>}>
            {!loading && (!data?.recentReviews?.length ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Star className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-600">No reviews yet</p>
                <p className="text-xs text-slate-400 mt-1">Reviews will appear here from customers</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data?.recentReviews?.slice(0, 5).map((review: any) => (
                  <div key={review.id} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                      {review.customer?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold truncate">{review.customer?.name || review.customer?.email || "Customer"}</p>
                        <RatingStars rating={review.rating || 5} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{fmtDate(review.createdAt)} • {review.medicine?.name}</p>
                      {review.comment && <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{review.comment}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </SectionCard>
        </div>

        <SectionCard title="Low Stock Alert" icon={AlertTriangle}>
          {!loading && (!data?.lowStockMedicines?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-3">
                <Package className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">All stocks are healthy</p>
              <p className="text-xs text-slate-400 mt-1">No medicines below stock threshold</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data?.lowStockMedicines?.map((med) => (
                <Link key={med.id} href={`/dashboard/seller/medicines/${med.id}`} className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all">
                  <div className="h-12 w-12 rounded-lg bg-white dark:bg-slate-800 overflow-hidden">
                    <img src={med.images?.[0] || "/logo.png"} alt={med.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{med.name}</p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 font-bold">Only {med.stock} left</p>
                  </div>
                  <Badge variant="outline" className="rounded-lg">Restock</Badge>
                </Link>
              ))}
            </div>
          ))}
        </SectionCard>
      </div>
    </RoleGuard>
  );
}
