"use client";

import { useEffect, useMemo, useState } from "react";
import RoleGuard from "@/components/common/role-guard";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiJson as api } from "@/lib/api";
import type { ApiList, Meta, Role, User } from "@/lib/types";
import Pagination from "@/components/common/Pagination";

const ROLE_OPTIONS: Array<{ label: string; value: "" | Role }> = [
  { label: "All roles", value: "" },
  { label: "SELLER", value: "SELLER" },
  { label: "CUSTOMER", value: "CUSTOMER" },
  { label: "ADMIN", value: "ADMIN" },
];

export default function AdminUsersPage() {
  const [rows, setRows] = useState<User[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState<"" | Role>("");

  // ✅ Search
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // ✅ debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // ✅ when filter changes, reset page
  useEffect(() => {
    setPage(1);
  }, [role, limit, debouncedSearch]);

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("page", String(page));
    sp.set("limit", String(limit));

    // ✅ IMPORTANT:
    // backend যদি search param "search" না নেয়, এখানে বদলাবে
    // Example: sp.set("q", debouncedSearch) or sp.set("searchTerm", debouncedSearch)
    if (debouncedSearch) sp.set("search", debouncedSearch);

    if (role) sp.set("role", role);
    return sp.toString();
  }, [page, limit, debouncedSearch, role]);

  const load = async () => {
    setLoading(true);
    try {
      const url = `/auth/users?${queryString}`;
      // ✅ debug
      // console.log("USERS URL:", url);

      const res = await api<ApiList<User[]>>(url);
      setRows(res.data ?? []);
      setMeta(res.meta ?? null);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load users");
      setRows([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  // ✅ strict UI fallback filter (server filter কাজ না করলেও search কাজ করবে)
  const displayedRows = useMemo(() => {
    const s = debouncedSearch.toLowerCase();

    let list = rows;
    if (role) list = list.filter((u) => u.role === role);

    if (!s) return list;

    return list.filter((u) => {
      const name = (u.name ?? "").toLowerCase();
      const email = (u.email ?? "").toLowerCase();
      return name.includes(s) || email.includes(s);
    });
  }, [rows, role, debouncedSearch]);

  const totalPages = useMemo(() => {
    if (!meta) return 1;
    return Math.max(1, meta.totalPage ?? Math.ceil(meta.total / meta.limit));
  }, [meta]);

  const canDeleteUser = (u: User) => u.role !== "ADMIN";

  const removeUser = async (u: User) => {
    if (!canDeleteUser(u)) return toast.error("Super Admin cannot be deleted.");
    if (!confirm(`Delete user: ${u.email}?`)) return;

    try {
      await api(`/auth/users/${u.id}`, { method: "DELETE" });
      toast.success("User deleted");
      load();
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
  };

  const resetFilters = () => {
    setRole("");
    setSearch("");
    setLimit(10);
    setPage(1);
  };

  return (
    <RoleGuard allow={["ADMIN"]}>
      <div className="p-4 space-y-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Users</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Role select + Search typing করলে instant filter হবে।
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={resetFilters}
             className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
            >
              Reset
            </button>
            <button
              onClick={load}
              className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 bg-white border rounded-2xl border-slate-200 dark:border-white/10 dark:bg-white/5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block mb-1 text-xs text-slate-600 dark:text-slate-300">Search</label>
              <input
                className="w-full px-3 py-2 bg-white border rounded-lg border-slate-200 dark:border-white/10 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Searching: <span className="font-medium">{debouncedSearch || "—"}</span>
              </p>
            </div>

            <div className="md:col-span-3">
              <label className="block mb-1 text-xs text-slate-600 dark:text-slate-300">Role</label>
              <select
                className="w-full px-3 py-2 bg-white border rounded-lg border-slate-200 dark:border-white/10 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.label} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block mb-1 text-xs text-slate-600 dark:text-slate-300">Per page</label>
              <select
                className="w-full px-3 py-2 bg-white border rounded-lg border-slate-200 dark:border-white/10 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="overflow-hidden bg-white border rounded-2xl border-slate-200 dark:border-white/10 dark:bg-white/5">
          {loading ? (
            <div className="p-6 text-sm text-slate-600 dark:text-slate-300">Loading...</div>
          ) : displayedRows.length === 0 ? (
            <div className="p-6 text-sm text-slate-600 dark:text-slate-300">No users found.</div>
          ) : (
            <div className="hidden lg:block">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-white/5">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Active</th>
                    <th className="p-3 text-left">Created</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRows.map((u) => (
                    <tr key={u.id} className="border-t border-slate-200 dark:border-white/10">
                      <td className="p-3 font-medium">{u.name || "—"}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.role}</td>
                      <td className="p-3">{u.isActive ? "Yes" : "No"}</td>
                      <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Link href={`/dashboard/admin/users/${u.id}`} className="px-3 py-2 text-xs border rounded-lg">
                            Open
                          </Link>
                          {u.role !== "ADMIN" && (
                            <button
                              onClick={() => removeUser(u)}
                              className="px-3 py-2 text-xs font-medium text-red-700 rounded-lg bg-red-50"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          total={meta?.total}
          limit={meta?.limit}
          disabled={loading}
          onPageChange={setPage}
        />
      </div>
    </RoleGuard>
  );
}
