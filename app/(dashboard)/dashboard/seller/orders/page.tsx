"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import RoleGuard from "@/components/common/role-guard";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import type { Meta, OrderStatus } from "@/lib/types";
import { statusColor } from "@/lib/types";

/** ✅ Seller can update only these statuses (customize as you want) */
const SELLER_CAN_SET: OrderStatus[] = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

/** ✅ Status transition guard (prevents invalid jumps) */
const NEXT_STATUS: Record<OrderStatus, OrderStatus[]> = {
  PLACED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

type SellerOrderItem = {
  id: string;
  quantity: number;
  price: number;

  medicine: {
    id: string;
    name: string;
    brand?: string | null;
  };

  order: {
    id: string;
    status: OrderStatus;
    total: number;
    createdAt: string;
    customer?: { id: string; name?: string | null; email: string } | null;
  };
};

type SellerOrderGroup = {
  orderId: string;
  status: OrderStatus;
  createdAt: string;
  total: number;
  customerEmail: string;
  items: Array<{
    id: string;
    medicineName: string;
    brand?: string | null;
    qty: number;
    price: number;
    itemTotal: number;
  }>;
};

function useDebounced<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SellerOrdersPage() {
  const [raw, setRaw] = useState<SellerOrderItem[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0 });

  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // UI states
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 500);

  const [status, setStatus] = useState<"" | OrderStatus>("");
  const [sortBy, setSortBy] = useState<"createdAt" | "status" | "total">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // prevent race condition
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

  const fetchSellerOrders = async () => {
    const myReqId = ++reqIdRef.current;
    setLoading(true);

    try {
      const res = await api<{ meta?: Meta; data: SellerOrderItem[] }>(
        `/orders/seller/me?${queryString}`
      );

      if (myReqId !== reqIdRef.current) return;

      const list = res?.data ?? [];
      setRaw(list);

      if (res?.meta) setMeta(res.meta);
      else setMeta({ page, limit, total: list.length }); // fallback
    } catch (e: any) {
      if (myReqId !== reqIdRef.current) return;
      toast.error(e?.message || "Failed to load seller orders");
      setRaw([]);
      setMeta({ page, limit, total: 0 });
    } finally {
      if (myReqId === reqIdRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  // group orderItems by orderId
  const groups: SellerOrderGroup[] = useMemo(() => {
    const map = new Map<string, SellerOrderGroup>();

    for (const row of raw) {
      const oid = row.order.id;

      if (!map.has(oid)) {
        map.set(oid, {
          orderId: oid,
          status: row.order.status,
          createdAt: row.order.createdAt,
          total: row.order.total,
          customerEmail: row.order.customer?.email ?? "—",
          items: [],
        });
      }

      const g = map.get(oid)!;
      g.status = row.order.status;
      g.total = row.order.total;

      g.items.push({
        id: row.id,
        medicineName: row.medicine.name,
        brand: row.medicine.brand ?? null,
        qty: row.quantity,
        price: row.price,
        itemTotal: row.price * row.quantity,
      });
    }

    return Array.from(map.values());
  }, [raw]);

  const totalPages = useMemo(() => {
    const t = meta.total ?? groups.length ?? 0;
    return Math.max(1, Math.ceil(t / (limit || 10)));
  }, [meta.total, groups.length, limit]);

  const updateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    if (!orderId) return;

    // optimistic update
    const prev = raw;
    setUpdatingOrderId(orderId);
    setRaw((cur) =>
      cur.map((r) =>
        r.order.id === orderId ? { ...r, order: { ...r.order, status: nextStatus } } : r
      )
    );

    try {
      await api(`/orders/seller/${orderId}/status`, {
        method: "PATCH",
        body: { status: nextStatus },
      });

      toast.success("Order status updated");
      // চাইলে refetch করতে পারো:
      // fetchSellerOrders();
    } catch (e: any) {
      setRaw(prev);
      toast.error(e?.message || "Order status update failed");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <RoleGuard allow={["SELLER", "ADMIN"]}>
      <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <div className="mx-auto space-y-4 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Seller Orders
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Total: {meta.total ?? groups.length}
              </p>
            </div>

            <button
              className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
              onClick={fetchSellerOrders}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search order/customer/medicine..."
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
              {(["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as OrderStatus[]).map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
              )}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-white border rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5"
            >
              <option value="createdAt">Sort: Created</option>
              <option value="status">Sort: Status</option>
              <option value="total">Sort: Total</option>
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
          ) : groups.length === 0 ? (
            <div className="p-6 text-sm border rounded-2xl bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10">
              No seller orders found.
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map((g) => {
                const locked = g.status === "CANCELLED" || g.status === "DELIVERED";

                /**  seller valid next options (based on current status) */
                const nextOptions = NEXT_STATUS[g.status].filter((s) => SELLER_CAN_SET.includes(s));

                return (
                  <div
                    key={g.orderId}
                    className="border shadow-sm rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur border-slate-200 dark:border-white/10"
                  >
                    {/* Order header */}
                    <div className="flex flex-col gap-2 p-4 border-b sm:flex-row sm:items-center sm:justify-between border-slate-200 dark:border-white/10">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          Order: {g.orderId.slice(0, 8)}...
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {g.customerEmail} • {new Date(g.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[g.status]}`}>
                          {g.status}
                        </span>

                        <select
                          className="px-3 py-2 text-xs bg-white border rounded-lg border-slate-200 dark:border-white/10 dark:bg-slate-900/40 disabled:opacity-60"
                          value={g.status}
                          disabled={locked || updatingOrderId === g.orderId || nextOptions.length === 0}
                          onChange={(e) => updateStatus(g.orderId, e.target.value as OrderStatus)}
                        >
                          {/* current status */}
                          <option value={g.status}>{updatingOrderId === g.orderId ? "Updating..." : g.status}</option>

                          {/* next statuses */}
                          {nextOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        <span className="px-3 py-2 text-xs font-semibold border rounded-lg border-slate-200 dark:border-white/10">
                          Tk {g.total}
                        </span>
                      </div>
                    </div>

                    {/* Items table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-[700px] w-full text-sm">
                        <thead className="text-xs bg-slate-50 dark:bg-white/5">
                          <tr className="[&>th]:px-4 [&>th]:py-3 text-left text-slate-600 dark:text-slate-300">
                            <th>Medicine</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th className="text-right">Item Total</th>
                          </tr>
                        </thead>
                        <tbody className="[&>tr>td]:px-4 [&>tr>td]:py-3">
                          {g.items.map((it) => (
                            <tr key={it.id} className="border-t border-slate-200 dark:border-white/10">
                              <td>
                                <p className="font-medium">{it.medicineName}</p>
                                {it.brand ? <p className="text-xs opacity-70">{it.brand}</p> : null}
                              </td>
                              <td>{it.qty}</td>
                              <td>Tk {it.price}</td>
                              <td className="text-right">Tk {it.itemTotal}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && groups.length > 0 && (
            <div className="flex flex-col gap-2 p-3 border rounded-2xl sm:flex-row sm:items-center sm:justify-between bg-white/80 dark:bg-white/5 backdrop-blur border-slate-200 dark:border-white/10">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Page {page} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-2 text-xs border rounded-lg disabled:opacity-50 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10"
                >
                  Prev
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-2 text-xs border rounded-lg disabled:opacity-50 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
