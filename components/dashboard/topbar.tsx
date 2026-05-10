"use client";

import useAuth from "@/components/hooks/useAuth";
import ThemeToggle from "./theme-toggle";
import { useMemo } from "react";
import { Bell, Search, ChevronDown, LogOut, Settings } from "lucide-react";

function initials(name?: string | null) {
  const parts = (name || "User").trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
}

function buildAssetUrl(raw?: string | null) {
  if (!raw) return "";
  const v = raw.trim();
  if (!v) return "";
  if (v.startsWith("http")) return v;
  const base = process.env.NEXT_PUBLIC_ASSET_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "";
  const b = base.replace(/\/+$/, "");
  const p = v.replace(/^\/+/, "");
  return `${b}/${p}`;
}

export default function Topbar() {
  const { user, logout } = useAuth();

  const avatarSrc = useMemo(() => {
    return buildAssetUrl((user as any)?.avatar);
  }, [user?.avatar]);

  const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    SELLER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    CUSTOMER: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  };

  return (
    <header className="sticky top-0 z-20 h-18 px-6 bg-white/80 backdrop-blur-xl border-b border-slate-200 dark:bg-slate-950/80 dark:border-slate-800">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h2>
            <p className="text-sm text-slate-500">Welcome back, {user?.name || "User"} 👋</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 h-10 pl-10 pr-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>

          <button className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-950" />
          </button>

          <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>

          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1" />

          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</div>
                <div className="flex items-center gap-2">
                  {user.role && (
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${roleColors[user.role] || "bg-slate-100 text-slate-600"}`}>
                      {user.role}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cyan-500/20 overflow-hidden">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt={user.name || "User"} className="object-cover w-full h-full" />
                    ) : (
                      initials(user.name)
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-900/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-50 dark:from-slate-800 dark:to-slate-800 border border-slate-200 dark:border-slate-700 mb-2">
                    <div className="font-semibold text-slate-900 dark:text-white">{user.name}</div>
                    <div className="text-sm text-slate-500">{user.email}</div>
                  </div>
                  <button
                    onClick={() => logout?.()}
                    className="flex items-center gap-3 w-full p-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
