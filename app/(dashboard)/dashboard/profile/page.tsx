"use client";

import { useEffect, useMemo, useState } from "react";
import RoleGuard from "@/components/common/role-guard";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { ApiOne, MeUser } from "@/lib/types";

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
  return `${b}/${p}`;
}

function initialsOf(name?: string | null, email?: string | null) {
  const s = (name || email || "U").trim();
  const parts = s.split(/\s+/).slice(0, 2);
  const ini = parts.map((x) => x[0]?.toUpperCase()).join("");
  return ini || s.slice(0, 1).toUpperCase();
}

export default function ProfileViewPage() {
  const [me, setMe] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

 const avatarUrl = useMemo(() => {
  const u = buildAssetUrl(me?.avatar);
  return u ? `${u}${u.includes("?") ? "&" : "?"}v=${(me as any)?.updatedAt || Date.now()}` : "";
}, [me?.avatar, (me as any)?.updatedAt]);

  const initials = useMemo(() => initialsOf(me?.name, me?.email), [me?.name, me?.email]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api<ApiOne<MeUser>>("/auth/me");
      setMe(res.data);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load profile");
      setMe(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <RoleGuard allow={["CUSTOMER", "SELLER", "ADMIN"]}>
      <div className="max-w-4xl p-4 mx-auto sm:p-6">
        <div className="relative overflow-hidden border shadow-sm rounded-3xl bg-white/70 backdrop-blur border-slate-200 dark:border-white/10 dark:bg-white/5">
          {/* Banner */}
          <div className="relative h-32 sm:h-40 bg-gradient-to-r from-[#2EB0D9] via-indigo-600 to-sky-500">
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_20%_20%,white,transparent_55%)]" />
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_80%_10%,white,transparent_60%)]" />

            {/* Edit button */}
            <div className="absolute flex items-center gap-2 top-4 right-4">
              <Link
                href="/dashboard/profile/edit"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white border rounded-xl bg-white/15 hover:bg-white/25 border-white/20 backdrop-blur"
              >
                Edit Profile
              </Link>
            </div>

            {/* Title */}
            <div className="absolute left-5 bottom-4">
              <h1 className="text-xl font-extrabold text-white sm:text-3xl">
                My Profile
              </h1>
              <p className="text-xs sm:text-sm text-white/85">
                View your basic info & account status
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-7">
            {loading ? (
              <div className="space-y-5 animate-pulse">
                <div className="mx-auto rounded-full w-28 h-28 bg-slate-200 dark:bg-white/10" />
                <div className="w-56 h-6 mx-auto rounded bg-slate-200 dark:bg-white/10" />
                <div className="h-4 mx-auto rounded w-72 bg-slate-200 dark:bg-white/10" />
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="h-20 rounded-2xl bg-slate-200 dark:bg-white/10" />
                  <div className="h-20 rounded-2xl bg-slate-200 dark:bg-white/10" />
                  <div className="h-20 rounded-2xl bg-slate-200 dark:bg-white/10" />
                </div>
              </div>
            ) : !me ? (
              <div className="text-sm text-slate-600 dark:text-slate-300">Not found</div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center">
                {/* Avatar + Role */}
                <div className="relative -mt-14 sm:-mt-16">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[3px] shadow-lg bg-gradient-to-br from-[#2EB0D9] via-indigo-600 to-[#38CAE4]">
                    <div className="flex items-center justify-center w-full h-full overflow-hidden bg-white rounded-full dark:bg-slate-950/30">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt="avatar" className="object-cover w-full h-full" />
                      ) : (
                        <div className="text-3xl font-black text-slate-900 dark:text-white">
                          {initials}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="absolute -translate-x-1/2 -bottom-3 left-1/2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold text-white rounded-full shadow bg-slate-900/90 dark:bg-white dark:text-slate-900">
                      {me.role}
                    </span>
                  </div>
                </div>

                {/* Name / Email */}
                <div className="pt-4">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {me.name || "No name"}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {me.email}
                  </div>
                </div>

                {/* Info cards */}
                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="p-4 text-left border rounded-2xl border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5">
                    <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Phone
                    </div>
                    <div className="mt-1 font-semibold text-slate-900 dark:text-white">
                      {me.phone || "No phone"}
                    </div>
                  </div>

                  <div className="p-4 text-left border rounded-2xl border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5">
                    <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Status
                    </div>
                    <div className="mt-1 font-semibold">
                      <span
                        className={
                          me.isActive ? "text-emerald-600" : "text-red-600"
                        }
                      >
                        {me.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 text-left border rounded-2xl border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5">
                    <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Joined
                    </div>
                    <div className="mt-1 font-semibold text-slate-900 dark:text-white">
                      {(me as any)?.createdAt
                        ? new Date((me as any).createdAt).toLocaleDateString()
                        : "—"}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <Link
                    href="/dashboard/profile/edit"
                    className="px-4 py-2 text-sm font-semibold text-white rounded-xl bg-[#2EB0D9] hover:bg-[#38CAE4]"
                  >
                    Edit Profile
                  </Link>

                  <Link
                    href="/"
                    className="px-4 py-2 text-sm font-semibold border rounded-xl border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
                  >
                    Back Home
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
