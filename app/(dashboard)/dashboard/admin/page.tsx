"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import RoleGuard from "@/components/common/role-guard";
import { apiJson as api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users, ShoppingBag, Package, DollarSign, TrendingUp, Eye, Clock, MessageSquare, BarChart3 } from "lucide-react";
import PiChatCard from "@/components/admin/PiChatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface AdminStats {
  users: { total: number; new7d: number };
  orders: { today: number; pending: number; processing: number; delivered?: number };
  medicines: { active: number; lowStock: number; lowStockThreshold: number };
  revenue: { today: number; thisMonth: number; changePct: number };
}

const COLORS = ["#06b6d4", "#2dd4bf", "#14b8a6", "#0d9488"];

const StatCard = ({ title, value, subtitle, icon: Icon, gradient, trend }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  gradient: string;
  trend?: { value: number; label: string };
}) => (
  <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all duration-300">
    <div className={`absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-3xl`} />
    <div className="relative flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        {trend && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className={`text-sm font-semibold ${trend.value >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-slate-400">{trend.label}</span>
          </div>
        )}
      </div>
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const SectionCard = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
      <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [chartData, setChartData] = useState<{ orders: { date: string; count: number }[]; categories: { name: string; value: number }[] }>({
    orders: [],
    categories: [],
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, categoriesRes] = await Promise.all([
        api<{ data: AdminStats }>("/admin/stats"),
        api<{ data: any[] }>("/admin/orders/recent?limit=7"),
        api<{ data: any[] }>("/categories"),
      ]);

      setStats(statsRes.data);
      setLastUpdate(new Date());

      const orderHistory = ordersRes.data?.map((o: any) => ({
        date: new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: o.total || 0,
      })) || [];

      const categoryCount = categoriesRes.data?.reduce((acc: Record<string, number>, c: any) => {
        acc[c.name] = (acc[c.name] || 0) + 1;
        return acc;
      }, {}) || {};

      const categoryChart = Object.entries(categoryCount).slice(0, 6).map(([name, value]) => ({ name, value }));

      setChartData({ orders: orderHistory, categories: categoryChart });
    } catch (e: any) {
      toast.error(e?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const socket = (window as any).__socket;
    if (!socket) return;

    const onAdminOnlineUsers = (users: string[]) => {
      setOnlineUsers(Array.isArray(users) ? users : []);
    };

    socket.on("admin:online-users", onAdminOnlineUsers);
    return () => { socket.off("admin:online-users", onAdminOnlineUsers); };
  }, []);

  const orderStatusData = stats ? [
    { name: "Pending", value: stats.orders.pending, color: "#f59e0b" },
    { name: "Processing", value: stats.orders.processing, color: "#06b6d4" },
    { name: "Delivered", value: stats.orders.delivered ?? 0, color: "#10b981" },
  ].filter(d => d.value > 0) : [];

  return (
    <RoleGuard allow={["ADMIN"]}>
      <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : "Loading..."}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                {onlineUsers.length} Online
              </span>
            </div>
          </div>
          <Button
            onClick={load}
            disabled={loading}
            className="gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={stats?.users.total ?? "—"}
            subtitle={`${stats?.users.new7d ?? 0} new this week`}
            icon={Users}
            gradient="from-purple-500 to-indigo-500"
            trend={{ value: 12, label: "this week" }}
          />
          <StatCard
            title="Today's Orders"
            value={stats?.orders.today ?? "—"}
            subtitle={`${stats?.orders.pending ?? 0} pending`}
            icon={ShoppingBag}
            gradient="from-cyan-500 to-teal-500"
            trend={{ value: 8, label: "vs yesterday" }}
          />
          <StatCard
            title="Revenue Today"
            value={`৳${(stats?.revenue.today ?? 0).toLocaleString()}`}
            icon={DollarSign}
            gradient="from-emerald-500 to-green-500"
            trend={{ value: stats?.revenue.changePct ?? 0, label: "vs last month" }}
          />
          <StatCard
            title="Active Medicines"
            value={stats?.medicines.active ?? "—"}
            subtitle={`${stats?.medicines.lowStock ?? 0} low stock`}
            icon={Package}
            gradient="from-amber-500 to-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SectionCard title="Orders Overview (Last 7 Days)">
              {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                </div>
              ) : chartData.orders.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.orders}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="count" fill="url(#cyanGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#2dd4bf" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-slate-500">
                  <BarChart3 className="w-12 h-12 mb-3 opacity-30" />
                  <p>No order data available</p>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Order Status Distribution">
              {loading ? (
                <div className="h-[250px] flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                </div>
              ) : orderStatusData.length > 0 ? (
                <div className="flex items-center justify-center gap-8">
                  <ResponsiveContainer width={160} height={200}>
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {orderStatusData.map((item) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm font-bold ml-auto pl-4">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[200px] flex flex-col items-center justify-center text-slate-500">
                  <BarChart3 className="w-12 h-12 mb-3 opacity-30" />
                  <p>No order status data</p>
                </div>
              )}
            </SectionCard>
          </div>

          <div className="space-y-6">
            <PiChatCard stats={stats} loading={loading} />

            <SectionCard title="Online Users">
              {onlineUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No active users</p>
                  <p className="text-xs text-slate-500 mt-1">Users will appear here when online</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {onlineUsers.slice(0, 10).map((uid) => (
                    <div key={uid} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                        {uid.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{uid}</p>
                        <p className="text-xs text-emerald-600">Online now</p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
