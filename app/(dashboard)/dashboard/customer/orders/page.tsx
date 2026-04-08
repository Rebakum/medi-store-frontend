"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { MyReview, Order, OrderUpdatedPayload, statusColor } from "@/lib/types";
import ReviewModal from "@/components/reviews/ReviewModal";
import useAuth from "@/hooks/useAuth";
import { getSocket } from "@/lib/socket";




const fmtDateTime = (iso: string) => {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const money = (n: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(n || 0);

export default function CustomerOrdersPage() {
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  // reviews
  const [myReviews, setMyReviews] = useState<MyReview[]>([]);
  const reviewedMedicineIds = useMemo(
    () => new Set(myReviews.map((r) => r.medicineId)),
    [myReviews]
  );

  // modal state
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api<{ data: Order[] }>("/orders/me");
      setOrders(res.data ?? []);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReviews = async () => {
    try {
      const res = await api<{ data: MyReview[] }>("/reviews/me");
      setMyReviews(res.data ?? []);
    } catch {
      // ignore
    }
  };

  // initial load
  useEffect(() => {
    fetchOrders();
    fetchMyReviews();
  }, []);

  //  SOCKET: connect + join + live updates
  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      // visitor connect হলে log
      console.log(" socket connected:", socket.id);

      // user থাকলে join (rooms)
      if (user?.id) {
        socket.emit("join", { userId: user.id, role: user.role });
      }
    };

    const onDisconnect = () => {
      console.log("socket disconnected");
    };

    const onOrderUpdated = (payload: OrderUpdatedPayload) => {
      // customer only their room e event আসবে, so safe
      setOrders((prev) =>
        prev.map((o) =>
          o.id === payload.orderId ? { ...o, status: payload.status } : o
        )
      );

      toast.success(`Order #${payload.orderId.slice(0, 8)} → ${payload.status}`);
    };

    // (optional) future: new order event
    const onOrderNew = (_payload: any) => {
      // if you ever emit new order to user room, you can refetch
      // fetchOrders();
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("order:updated", onOrderUpdated);
    socket.on("order:new", onOrderNew);

    // already connected থাকলে join trigger করতে:
    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("order:updated", onOrderUpdated);
      socket.off("order:new", onOrderNew);
    };
  }, [user?.id, user?.role]);

  const cancelOrder = async (orderId: string) => {
    setBusyId(orderId);
    try {
      await api(`/orders/${orderId}/cancel`, { method: "PATCH" });
      toast.success("Order cancelled");
      await fetchOrders();
    } catch (e: any) {
      toast.error(e?.message || "Cancel failed");
    } finally {
      setBusyId(null);
    }
  };

  const reorder = async (order: Order) => {
    setBusyId(order.id);
    try {
      await api("/orders/checkout", {
        method: "POST",
        body: {
          address: order.address,
          phone: order.phone,
          items: order.items.map((i) => ({
            medicineId: i.medicineId ?? i.medicine?.id,
            quantity: i.quantity,
          })),
        },
      });

      toast.success("Reorder successful!");
      await fetchOrders();
    } catch (e: any) {
      toast.error(e?.message || "Reorder failed");
    } finally {
      setBusyId(null);
    }
  };

  const openReview = (order: Order, itemIndex = 0) => {
    setSelectedOrder(order);
    setSelectedItemIndex(itemIndex);
    setReviewOpen(true);
  };

  const currentItem = selectedOrder?.items?.[selectedItemIndex] ?? null;
  const currentMedicineId =
    currentItem?.medicineId ?? currentItem?.medicine?.id ?? "";
  const alreadyReviewed = currentMedicineId
    ? reviewedMedicineIds.has(currentMedicineId)
    : false;

  return (
    <div className="space-y-6">
      {/* Review Modal */}
      <ReviewModal
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        orderId={selectedOrder?.id ?? ""}
        item={currentItem}
        alreadyReviewed={alreadyReviewed}
        onDone={async () => {
          await fetchMyReviews();
          toast.success("Thanks for your review!");
        }}
      />

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            My Orders
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Track your orders and leave reviews after delivery.
          </p>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white
                     bg-gradient-to-r from-[#2EB0D9] to-[#38CAE4]
                     hover:from-[#38CAE4] hover:to-[#2EB0D9]
                     transition shadow-sm active:scale-[0.98] disabled:opacity-60"
          onClick={() => {
            fetchOrders();
            fetchMyReviews();
          }}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden bg-white border rounded-2xl dark:bg-white/5 dark:border-white/10">
        <div className="px-4 py-3 border-b bg-slate-50 dark:bg-white/5 dark:border-white/10">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Orders List
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click view to see details, cancel placed orders, review delivered.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs bg-muted/40">
              <tr className="[&>th]:px-4 [&>th]:py-3 text-left">
                <th>Order</th>
                <th>Status</th>
                <th>Total</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="[&>tr>td]:px-4 [&>tr>td]:py-4">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-sm text-center opacity-70">
                    Loading...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-sm text-center opacity-70">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o, idx) => (
                  <tr
                    key={o.id}
                    className={`border-t transition hover:bg-sky-50/60 dark:hover:bg-white/5 ${
                      idx % 2 === 0 ? "bg-white dark:bg-transparent" : "bg-slate-50/40 dark:bg-white/0"
                    }`}
                  >
                    <td className="font-semibold text-slate-900 dark:text-slate-100">
                      #{o.id.slice(0, 8)}
                    </td>

                    <td>
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColor[o.status]}`}
                      >
                        {o.status}
                      </span>
                    </td>

                    <td className="font-semibold">{money(o.total)}</td>

                    <td className="text-xs text-slate-600 dark:text-slate-300">
                      {fmtDateTime(o.createdAt)}
                    </td>

                    <td className="space-x-2 text-right">
                      <Link
                        href={`/dashboard/customer/orders/${o.id}`}
                        className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold transition rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                      >
                        View
                      </Link>

                      {o.status === "PLACED" && (
                        <button
                          onClick={() => cancelOrder(o.id)}
                          disabled={busyId === o.id}
                          className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold transition rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/15 dark:text-rose-200 dark:hover:bg-rose-500/25 disabled:opacity-60"
                        >
                          {busyId === o.id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}

                      {o.status === "CANCELLED" && (
                        <button
                          onClick={() => reorder(o)}
                          disabled={busyId === o.id}
                          className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold transition rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-200 dark:hover:bg-emerald-500/25 disabled:opacity-60"
                        >
                          {busyId === o.id ? "Reordering..." : "Reorder"}
                        </button>
                      )}

                      {o.status === "DELIVERED" && (
                        <button
                          onClick={() => openReview(o, 0)}
                          className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold text-indigo-700 transition rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-200 dark:hover:bg-indigo-500/25"
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Review */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Delivered Items (Quick Review)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Review each delivered medicine. Already reviewed items will be disabled.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {orders
            .filter((o) => o.status === "DELIVERED")
            .flatMap((o) =>
              o.items.map((it, idx) => {
                const mid = it.medicineId ?? it.medicine?.id ?? "";
                const done = mid ? reviewedMedicineIds.has(mid) : false;

                return (
                  <div
                    key={`${o.id}-${idx}`}
                    className="p-4 transition border shadow-sm bg-slate rounded-2xl hover:shadow-md dark:bg-white/5 dark:border-white/10"
                  >
                    <p className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
                      {it.medicine?.name ?? "Medicine"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Order: #{o.id.slice(0, 8)}
                    </p>

                    <button
                      onClick={() => openReview(o, idx)}
                      disabled={done}
                      className={`mt-4 w-full px-3 py-2 text-xs font-semibold rounded-xl transition border
                        ${
                          done
                            ? "opacity-60 cursor-not-allowed bg-muted/30"
                            : "bg-[#2EB0D9]/10 hover:bg-[#2EB0D9]/20 text-[#2EB0D9] border-[#2EB0D9]/20"
                        }`}
                    >
                      {done ? "Reviewed" : "Write a review"}
                    </button>
                  </div>
                );
              })
            )}
        </div>

        {orders.filter((o) => o.status === "DELIVERED").length === 0 && (
          <div className="p-6 border rounded-2xl bg-muted/20">
            <p className="text-sm font-medium">No delivered orders yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Once an order is delivered, you can review it from here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
