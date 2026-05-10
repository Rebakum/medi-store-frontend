"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import RoleGuard from "@/components/common/role-guard";
import { apiJson as api } from "@/lib/api";

type Review = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt?: string;

  medicine?: {
    id: string;
    name: string;
    images?: string[];
  };

  user?: {
    id: string;
    name?: string | null;
    email: string;
    avatar?: string | null;
  };
};

function RatingStars({ value }: { value: number }) {
  const v = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${i < v ? "fill-yellow-400" : "fill-gray-200"}`}
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white border shadow-xl rounded-2xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-xl hover:bg-gray-100"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

const asset = (raw?: string | null) => {
  if (!raw) return null;
  const s = raw.trim();
  if (!s) return null;
  if (s.startsWith("http")) return s;
  return `${process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? ""}${s}`;
};

const fmt = (d?: string) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
};

export default function SellerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Review | null>(null);

  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api<{ data: any }>("/seller/stats");
      const list: Review[] = res.data?.recentReviews ?? [];
      setReviews(list);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return reviews.filter((r) => {
      const med = (r.medicine?.name || "").toLowerCase();
      const uname = (r.user?.name || "").toLowerCase();
      const email = (r.user?.email || "").toLowerCase();
      return !query || med.includes(query) || uname.includes(query) || email.includes(query);
    });
  }, [reviews, q]);

  const openView = (r: Review) => {
    setActive(r);
    setOpen(true);
  };

  const deleteReview = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this review?");
    if (!ok) return;

    setBusyId(id);
    try {
      await api(`/reviews/${id}`, { method: "DELETE" } as any);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted");
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <RoleGuard allow={["SELLER"]}>
      <div className="p-6">
        {/* header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Medicine Reviews</h1>
            <p className="mt-1 text-sm text-gray-600">
              Medicine on top, customer info below.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/seller"
              className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Back
            </Link>

            <button
              onClick={fetchReviews}
              className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* search + total */}
        <div className="flex flex-col gap-2 mt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full gap-2 sm:w-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by medicine / customer..."
              className="w-full px-3 py-2 border sm:w-80 rounded-xl"
            />
          </div>

          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold">{loading ? "…" : filtered.length}</span>
          </div>
        </div>

        {loading && <p className="mt-6 text-sm text-gray-600">Loading...</p>}

        {!loading && filtered.length === 0 && (
          <div className="p-8 mt-10 text-center bg-white border rounded-2xl">
            <h2 className="text-lg font-semibold">No reviews found</h2>
            <p className="mt-1 text-sm text-gray-600">
              Try searching with a different keyword.
            </p>
          </div>
        )}

        {/* grid */}
        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => {
            const medRaw = r.medicine?.images?.[0] ?? null;
            const medImg = asset(medRaw);
            const userImg = asset(r.user?.avatar ?? null);

            return (
              <div
                key={r.id}
                className="p-4 transition bg-white border shadow-sm rounded-2xl hover:shadow-md"
              >
                {/*  TOP: Medicine */}
                <div className="flex gap-3">
                  <div className="overflow-hidden bg-gray-100 h-14 w-14 rounded-xl shrink-0">
                    {medImg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={medImg}
                        alt="medicine"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-xs text-gray-500">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/shop/${r.medicine?.id}`}
                      className="block font-semibold truncate hover:underline"
                    >
                      {r.medicine?.name || "Medicine"}
                    </Link>

                    <div className="flex items-center gap-2 mt-1">
                      <RatingStars value={r.rating} />
                      <span className="text-xs text-gray-500">{r.rating}/5</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openView(r)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    View
                  </button>
                </div>

                {/* comment */}
                <p className="mt-3 text-sm text-gray-700 break-words line-clamp-3">
                  {r.comment || "No comment"}
                </p>

                {/*  BOTTOM: Customer */}
                <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t">
                  <div className="flex items-center min-w-0 gap-3">
                    <div className="w-10 h-10 overflow-hidden bg-gray-100 rounded-full shrink-0">
                      {userImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={userImg}
                          alt="customer"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-[10px] text-gray-500">
                          No img
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {r.user?.name || "Customer"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{r.user?.email || "—"}</p>
                      <p className="text-[11px] text-gray-400">{fmt(r.createdAt)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteReview(r.id)}
                    disabled={busyId === r.id}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-60"
                  >
                    {busyId === r.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* modal */}
        <Modal open={open} title="Review Details" onClose={() => setOpen(false)}>
          {active ? (
            <div className="space-y-4">
              {/* medicine top */}
              <div className="flex gap-3">
                <div className="overflow-hidden bg-gray-100 h-14 w-14 rounded-xl shrink-0">
                  {asset(active.medicine?.images?.[0] ?? null) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset(active.medicine?.images?.[0] ?? null) as string}
                      alt="medicine"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-xs text-gray-500">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {active.medicine?.name || "Medicine"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <RatingStars value={active.rating} />
                    <span className="text-xs text-gray-500">{active.rating}/5</span>
                  </div>
                </div>
              </div>

              <div className="p-3 border rounded-xl bg-gray-50">
                <p className="text-sm text-gray-700 break-words">
                  {active.comment || "No comment"}
                </p>
              </div>

              {/* customer bottom */}
              <div className="flex items-center gap-3 pt-3 border-t">
                <div className="w-10 h-10 overflow-hidden bg-gray-100 rounded-full shrink-0">
                  {asset(active.user?.avatar ?? null) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset(active.user?.avatar ?? null) as string}
                      alt="customer"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-[10px] text-gray-500">
                      No img
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {active.user?.name || "Customer"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{active.user?.email || "—"}</p>
                  <p className="text-[11px] text-gray-400">{fmt(active.createdAt)}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </RoleGuard>
  );
}
