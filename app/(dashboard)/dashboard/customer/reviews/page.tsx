"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RoleGuard from "@/components/common/role-guard";
import { api } from "@/lib/api";

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

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  // edit modal states
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null); // for delete button

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api<{ data: Review[] }>("/reviews/me");
      setReviews(res.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return reviews.filter((r) =>
      (r.medicine?.name || "").toLowerCase().includes(query)
    );
  }, [reviews, q]);

  const openEdit = (r: Review) => {
    setEditId(r.id);
    setEditRating(Math.max(1, Math.min(5, r.rating || 5)));
    setEditComment(r.comment ?? "");
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editId) return;
    setSaving(true);
    try {
      const payload = {
        rating: editRating,
        comment: editComment.trim() ? editComment.trim() : null,
      };

      await api(`/reviews/${editId}`, {
        method: "PATCH",
        body: payload,
      });

      // update UI instantly
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editId ? { ...r, rating: payload.rating, comment: payload.comment } : r
        )
      );

      setEditOpen(false);
      setEditId(null);
    } catch (e: any) {
      alert(e?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteReview = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this review?");
    if (!ok) return;

    setBusyId(id);
    try {
      await api(`/reviews/${id}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (e: any) {
      alert(e?.message || "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <RoleGuard allow={["CUSTOMER", "SELLER", "ADMIN"]}>
      <div className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">My Reviews</h1>
            <p className="mt-1 text-sm text-gray-600">
              You can edit or delete your reviews.
            </p>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search medicine..."
              className="w-full px-3 py-2 border sm:w-72 rounded-xl"
            />
            <button
              onClick={fetchReviews}
              className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
              disabled={loading}
            >
              Refresh
            </button>
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

        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => {
            const rawImg = r.medicine?.images?.[0];

            const img =
              rawImg && rawImg.startsWith("http")
                ? rawImg
                : rawImg
                ? `${process.env.NEXT_PUBLIC_ASSET_BASE_URL}${rawImg}`
                : null;

            return (
              <div
                key={r.id}
                className="p-4 transition bg-white border shadow-sm hover:bg-sky-100 rounded-2xl hover:shadow-md"
              >
                <div className="flex gap-3">
                  <div className="overflow-hidden bg-gray-100 h-14 w-14 rounded-xl shrink-0">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
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
                      {r.medicine?.name}
                    </Link>

                    <div className="flex items-center gap-2 mt-1">
                      <RatingStars value={r.rating} />
                      <span className="text-xs text-gray-500">{r.rating}/5</span>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-700 break-words">
                  {r.comment || "No comment"}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-gray-500">
                    {r.createdAt && new Date(r.createdAt).toLocaleString()}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(r)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteReview(r.id)}
                      disabled={busyId === r.id}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-60"
                    >
                      {busyId === r.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Modal */}
        <Modal
          open={editOpen}
          title="Edit Review"
          onClose={() => {
            if (!saving) setEditOpen(false);
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Rating</label>
              <select
                value={editRating}
                onChange={(e) => setEditRating(Number(e.target.value))}
                className="w-full px-3 py-2 mt-1 text-sm border rounded-xl"
              >
                <option value={5}>5 ★</option>
                <option value={4}>4 ★</option>
                <option value={3}>3 ★</option>
                <option value={2}>2 ★</option>
                <option value={1}>1 ★</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Comment</label>
              <textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 mt-1 text-sm border rounded-xl"
                placeholder="Write comment..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Empty রাখলে comment remove হয়ে যাবে।
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditOpen(false)}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                disabled={saving || !editId}
                className="px-4 py-2 text-sm font-medium rounded-xl text-white
                           bg-gradient-to-r from-[#ff8a05] via-[#ff5478] to-[#ff00c6]
                           hover:opacity-95 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </RoleGuard>
  );
}
