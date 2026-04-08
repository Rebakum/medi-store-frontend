"use client";

import useAuth from "@/hooks/useAuth";
import ThemeToggle from "./theme-toggle";
import { useMemo } from "react";



function initials(name?: string | null) {
  const parts = (name || "User").trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
}

function buildAssetUrl(raw?: string | null) {
  if (!raw) return "";
  const v = raw.trim();
  if (!v) return "";
  if (v.startsWith("http")) return v;

  const base =
    process.env.NEXT_PUBLIC_ASSET_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
    "";

  const b = base.replace(/\/+$/, "");
  const p = v.replace(/^\/+/, "");
  return `${b}/${p}`;
}

export default function Topbar() {
  const { user, logout } = useAuth();

  //  avatar url build
  const avatarSrc = useMemo(() => {
    return buildAssetUrl((user as any)?.avatar);
  }, [user?.avatar]);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b bg-background/70 backdrop-blur">
      {/* Left */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Dashboard</h2>
        <p className="text-xs text-slate-500">Welcome back 👋</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {user && (
          <div className="flex items-center gap-3 px-3 py-1 transition rounded-full bg-white/60 hover:bg-white dark:bg-white/5 dark:hover:bg-white/10">
            {/* Avatar */}
            <div className="flex items-center justify-center overflow-hidden rounded-full w-9 h-9 bg-sky-100 text-sky-600">
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarSrc}
                  alt={user.name || "User"}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-xs font-semibold">
                  {initials(user.name)}
                </span>
              )}
            </div>

            {/* User info */}
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>

            {/* Role badge */}
            {user.role && (
              <span className="hidden px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#2EB0D9]/10 text-[#2EB0D9] sm:inline-block">
                {user.role}
              </span>
            )}

            {/* Logout */}
            <button
              onClick={() => logout?.()}
              className="ml-2 text-xs font-medium text-red-500 transition hover:text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
