"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import RoleGuard from "@/components/common/role-guard";
import { api } from "@/lib/api";
import type { Medicine, Meta } from "@/lib/types";
import MyMedicinesTable from "@/components/dashboard/my-medicines-table";
import Link from "next/link";

function useDebounced<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}


const ALL_STATUS = ["", "ACTIVE", "INACTIVE", "OUT_OF_STOCK"] as const;
type StatusFilter = (typeof ALL_STATUS)[number];

export default function SellerMedicinesPage() {
  const basePath = "/dashboard/seller/medicines"; 

  const [items, setItems] = useState<Medicine[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // UI states
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 500);

  const [status, setStatus] = useState<StatusFilter>("");
  const [sortBy, setSortBy] = useState<"createdAt" | "price" | "stock" | "name">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // race condition guard
  const reqIdRef = useRef(0);

  const queryString = useMemo(() => {
    const q = new URLSearchParams();
    q.set("page", String(page));
    q.set("limit", String(limit));
    q.set("sortBy", sortBy);
    q.set("sortOrder", sortOrder);
    if (debouncedSearch.trim()) q.set("search", debouncedSearch.trim());
    if (status) q.set("status", status);
    return q.toString();
  }, [page, limit, sortBy, sortOrder, debouncedSearch, status]);

  const fetchItems = async () => {
    const myReqId = ++reqIdRef.current;
    setLoading(true);
    try {
     
      const res = await api<{ meta: Meta; data: Medicine[] }>(`/medicines/my?${queryString}`);
      if (myReqId !== reqIdRef.current) return;

      setItems(res.data ?? []);
      if (res.meta) setMeta(res.meta);
    } catch (e: any) {
      if (myReqId !== reqIdRef.current) return;
      toast.error(e?.message || "Failed to load medicines");
      setItems([]);
    } finally {
      if (myReqId === reqIdRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const totalPages = useMemo(() => {
    const t = meta.total ?? 0;
    return Math.max(1, Math.ceil(t / limit));
  }, [meta.total, limit]);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this medicine?")) return;
    setDeletingId(id);
    try {
      await api(`/medicines/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      // page empty হলে prev page এ নামাও (optional)
      await fetchItems();
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <RoleGuard allow={["SELLER", "ADMIN"]}>
      <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <div className="mx-auto space-y-4 max-w-7xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                My Medicines
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Total: {meta.total ?? 0}
              </p>
            </div>

            <button
              onClick={fetchItems}
              className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
            >
              Refresh
            </button>
            <Link
                href={`${basePath}/new`}
                className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
              >
                + Add Medicine
              </Link>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search name/brand/category..."
              className="w-full px-3 py-2 text-sm bg-white border rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5"
            />

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as StatusFilter);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-white border rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">DISABLED</option>
              <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-white border rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5"
            >
              <option value="createdAt">Sort: Created</option>
              <option value="price">Sort: Price</option>
              <option value="stock">Sort: Stock</option>
              <option value="name">Sort: Name</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-white border rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-white border rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  Per page: {n}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          {loading ? (
            <div className="p-6 text-sm border rounded-2xl bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10">
              Loading...
            </div>
          ) : (
            <MyMedicinesTable items={items} onDelete={onDelete} deletingId={deletingId} basePath={basePath} />
          )}

          {/* Pagination */}
          <div className="flex flex-col gap-2 p-3 border rounded-2xl sm:flex-row sm:items-center sm:justify-between bg-white/80 dark:bg-white/5 backdrop-blur border-slate-200 dark:border-white/10">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Page {page} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 text-xs border rounded-lg disabled:opacity-50 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10"
              >
                Prev
              </button>

              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-2 text-xs border rounded-lg disabled:opacity-50 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
