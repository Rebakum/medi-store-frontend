"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import RoleGuard from "@/components/common/role-guard";
import { api } from "@/lib/api";
import { Meta, Order, OrderStatus, statusColor } from "@/lib/types";



const ALL_STATUS: OrderStatus[] = [
  "PLACED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];


function useDebounced<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // UI state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | OrderStatus>("");
  const [sortBy, setSortBy] = useState<"createdAt" | "total" | "status">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounced(search, 500);
    // prevent race condition
  const reqIdRef = useRef(0);
 

  const queryString = useMemo(() => {
    const q = new URLSearchParams();
    q.set("page", String(page));
    q.set("limit", String(meta.limit ?? 10));
    q.set("sortBy", sortBy);
    q.set("sortOrder", sortOrder);

    if (debouncedSearch.trim()) q.set("search", debouncedSearch.trim());
    if (status) q.set("status", status);

    return q.toString();
  }, [page, meta.limit, sortBy, sortOrder, debouncedSearch, status]);

  const fetchOrders = async () => {
    const myReqId = ++reqIdRef.current;
    setLoading(true);

    try {
      // backend already returns { meta, data } in your service
      const res = await api<{ meta: Meta; data: Order[] }>(`/orders?${queryString}`);
      if (myReqId !== reqIdRef.current) return; // ignore old response

      setOrders(res.data ?? []);
      if (res.meta) setMeta(res.meta);
    } catch (e: any) {
      if (myReqId !== reqIdRef.current) return;
      toast.error(e?.message || "Failed to load orders");
      setOrders([]);
    } finally {
      if (myReqId === reqIdRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const formattedDates = useMemo(() => {
    const map = new Map<string, string>();
    for (const o of orders) {
      map.set(o.id, new Date(o.createdAt).toLocaleString());
    }
    return map;
  }, [orders]);

  const updateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    setUpdatingId(orderId);

   
    const prev = orders;
    setOrders((cur) =>
      cur.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );

    try {
      await api(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: { status: nextStatus },
      });
      toast.success("Order status updated");
    
      // fetchOrders();
    } catch (e: any) {
      setOrders(prev); 
      toast.error(e?.message || "Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = useMemo(() => {
    const limit = meta.limit || 10;
    const total = meta.total || 0;
    return Math.max(1, Math.ceil(total / limit));
  }, [meta.limit, meta.total]);

  return (
    <RoleGuard allow={["ADMIN"]}>
      <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <div className="mx-auto space-y-4 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Admin Orders
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Total: {meta.total ?? 0}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={fetchOrders}
                className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by order/customer/medicine..."
              className="w-full px-3 py-2 text-sm bg-white border rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5"
            />

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as any);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-white border rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5"
            >
              <option value="">All Status</option>
              {ALL_STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-white border rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5"
            >
              <option value="createdAt">Sort: Created</option>
              <option value="total">Sort: Total</option>
              <option value="status">Sort: Status</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-white border rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-hidden border shadow-sm bg-white/80 dark:bg-white/5 backdrop-blur border-slate-200 dark:border-white/10 rounded-2xl">
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="text-xs bg-slate-50 dark:bg-white/5">
                  <tr className="[&>th]:px-4 [&>th]:py-3 text-left text-slate-600 dark:text-slate-300">
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Created</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="[&>tr>td]:px-4 [&>tr>td]:py-4">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center opacity-70">
                        Loading...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center opacity-70">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr
                        key={o.id}
                        className="transition border-t border-slate-200 dark:border-white/10 hover:bg-pink-50/60 dark:hover:bg-white/5"
                      >
                        <td className="font-medium">{o.id.slice(0, 8)}...</td>

                        <td className="text-xs">{o.customer?.email ?? "—"}</td>

                        <td>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[o.status]}`}>
                            {o.status}
                          </span>
                        </td>

                        <td>৳ {o.total}</td>

                        <td className="text-xs opacity-80">{formattedDates.get(o.id)}</td>

                        <td className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/admin/orders/${o.id}`}
                            className="px-2 py-1 text-xs border rounded-lg border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10"
                          >
                            View
                          </Link>

                          <select
                            className="px-2 py-1 text-xs bg-white border rounded-lg border-slate-200 dark:border-white/10 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100"
                            value={o.status}
                            disabled={updatingId === o.id}
                            onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                          >
                            {ALL_STATUS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-2 p-3 border-t sm:flex-row sm:items-center sm:justify-between border-slate-200 dark:border-white/10">
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
      </div>
    </RoleGuard>
  );
}
