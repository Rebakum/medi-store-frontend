"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import RoleGuard from "@/components/common/role-guard";
import { apiJson as api } from "@/lib/api";

import type { AdminStats, AdminDashboardResponse } from "@/lib/admin-dashboard";

import { Button } from "@/components/ui/button";

import KpiGrid from "@/components/admin/KpiGrid";
import AnalyticsCard from "@/components/admin/AnalyticsCard";
import PiChatCard from "@/components/admin/PiChatCard";
import RealtimeStatus from "@/components/common/RealtimeStatus";

//  socket
import { getSocket } from "@/lib/socket";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [charts, setCharts] = useState<AdminDashboardResponse["charts"] | null>(null);

  //  realtime online users (admin দেখবে)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      // stats always
      const statsRes = await api<{ data: AdminStats }>("/admin/stats");
      setStats(statsRes.data);

      // charts (optional)
      try {
        const dashRes = await api<{ data: AdminDashboardResponse }>("/admin/dashboard");
        if (dashRes.data?.stats) setStats(dashRes.data.stats);
        setCharts(dashRes.data?.charts ?? null);
      } catch {
        setCharts(null);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to load dashboard");
      setStats(null);
      setCharts(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ socket: listen admin online users
  useEffect(() => {
    const socket = getSocket();

    const onAdminOnlineUsers = (users: string[]) => {
      setOnlineUsers(Array.isArray(users) ? users : []);
    };

    socket.on("admin:online-users", onAdminOnlineUsers);

    // optional: request initial snapshot (only if you add backend handler)
    // socket.emit("admin:online-users:get");

    return () => {
      socket.off("admin:online-users", onAdminOnlineUsers);
    };
  }, []);

  return (
    <RoleGuard allow={["ADMIN"]}>
      <div className="p-4 space-y-6 sm:p-6">
        {/* Top bar status */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <RealtimeStatus variant="badge" />
            <div className="px-3 py-1 text-xs font-semibold rounded-full border bg-[#2EB0D9]/10 text-[#2EB0D9] border-[#2EB0D9]/20">
              👥 Online: {onlineUsers.length}
            </div>
          </div>

          <Button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Live monitoring + analytics overview.
          </p>
        </div>

        {/* ✅ Online Users Panel */}
        <div className="overflow-hidden bg-white border rounded-2xl dark:bg-white/5 dark:border-white/10">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50 dark:bg-white/5 dark:border-white/10">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Online Users
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Updates in realtime via Socket.io (admin only)
              </p>
            </div>

            <span className="px-2.5 py-1 text-xs font-semibold rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-500/30">
              {onlineUsers.length} online
            </span>
          </div>

          <div className="p-4">
            {onlineUsers.length === 0 ? (
              <div className="p-6 text-sm border rounded-2xl bg-muted/20">
                <p className="font-medium">No active users right now</p>
                <p className="mt-1 text-muted-foreground">
                  When users connect, they will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {onlineUsers.map((uid) => (
                  <div
                    key={uid}
                    className="flex items-center justify-between p-4 border rounded-2xl bg-slate-50/40 dark:bg-white/5 dark:border-white/10"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
                        {uid}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Connected
                      </p>
                    </div>

                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* KPI */}
        <KpiGrid stats={stats} loading={loading} />

        {/* Chart */}
        <AnalyticsCard charts={charts} loading={loading} />

        {/* PI Chat */}
        <PiChatCard stats={stats} loading={loading} />
      </div>
    </RoleGuard>
  );
}
