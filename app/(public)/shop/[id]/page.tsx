"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiJson } from "@/lib/api";
import type { Medicine } from "@/lib/types";
import Badge from "@/components/common/Badge";
import useCart from "@/features/cart/useCart";
import ImageSlider from "@/components/common/ImageSlider";
import toast from "react-hot-toast";
import { isLoggedIn } from "@/lib/auth";

type ApiOne<T> = { success: boolean; message: string; data: T };

export default function MedicineDetailsPage() {
  const { add } = useCart();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [m, setM] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  const assetBase = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "";

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      try {
        const res = await apiJson<ApiOne<Medicine>>(`/medicines/${id}`);
        setM(res.data);
      } catch (e) {
        console.error(e);
        setM(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const fetchReviews = async () => {
    if (!id) return;
    try {
      const res = await apiJson<{ success: boolean; data: any[] }>(`/reviews/medicine/${id}`);
      setReviews(res.data ?? []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const cartImg = useMemo(() => {
    const first = m?.images?.[0]?.trim();
    if (!first) return "/placeholder.png";
    return first.startsWith("http") ? first : `${assetBase}${first}`;
  }, [m?.images, assetBase]);

  const canBuy = !!m && m.status !== "DISABLED" && m.status !== "OUT_OF_STOCK" && m.stock > 0;

  const submitReview = async () => {
    if (!id) return;

    if (!isLoggedIn()) {
      router.push(`/login?redirect=/medicines/${id}`);
      return;
    }

    const c = comment.trim();
    if (!c) {
      toast.error("Please write a comment");
      return;
    }

    setPosting(true);
    try {
      await apiJson(`/reviews`, {
        method: "POST",
        body: JSON.stringify({ medicineId: id, rating, comment: c }),
      });
      toast.success("Review added!");
      setComment("");
      setRating(5);
      await fetchReviews();
    } catch (e: any) {
      toast.error(e.message || "Review failed");
    } finally {
      setPosting(false);
    }
  };

  const gotoCart = () => {
    if (!m) return;
    add({ id: m.id, name: m.name, price: m.price, image: cartImg });

    if (!isLoggedIn()) {
      router.push("/login?redirect=/dashboard/customer/cart");
      return;
    }
    // router.push("/dashboard/customer/cart");
  };

  const gotoCheckout = () => {
    if (!m) return;
    add({ id: m.id, name: m.name, price: m.price, image: cartImg });

    if (!isLoggedIn()) {
      router.push("/login?redirect=/dashboard/customer/checkout");
      return;
    }
    router.push("/dashboard/customer/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="h-10 rounded-lg w-60 bg-slate-200/70 dark:bg-white/10 animate-pulse" />
          <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
            <div className="h-[340px] rounded-2xl bg-slate-200/70 dark:bg-white/10 animate-pulse" />
            <div className="space-y-3">
              <div className="w-2/3 h-6 rounded bg-slate-200/70 dark:bg-white/10 animate-pulse" />
              <div className="w-1/2 h-4 rounded bg-slate-200/70 dark:bg-white/10 animate-pulse" />
              <div className="w-40 h-10 rounded bg-slate-200/70 dark:bg-white/10 animate-pulse" />
              <div className="h-28 rounded-2xl bg-slate-200/70 dark:bg-white/10 animate-pulse" />
              <div className="h-12 rounded-2xl bg-slate-200/70 dark:bg-white/10 animate-pulse" />
              <div className="h-12 rounded-2xl bg-slate-200/70 dark:bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!m) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <div className="max-w-3xl p-6 mx-auto border bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-2xl">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Medicine not found</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            The medicine you are looking for doesn’t exist.
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 mt-4 text-sm bg-white border rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-100"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const statusText =
    m.status === "DISABLED"
      ? "This item is disabled"
      : m.stock <= 0 || m.status === "OUT_OF_STOCK"
      ? "Out of stock"
      : `In stock: ${m.stock}`;

  const statusPill =
    m.status === "DISABLED" || m.status === "OUT_OF_STOCK" || m.stock <= 0
      ? "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200"
      : "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200";

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm border rounded-xl border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur hover:bg-white dark:hover:bg-white/10 text-slate-700 dark:text-slate-100"
          >
            ← Back
          </button>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusPill}`}>
              {statusText}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Images */}
          <div className="px-3 py-10 border bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-2xl">
            <ImageSlider
              images={m.images || []}
              alt={m.name}
              aspectClass="h-[340px] rounded-xl overflow-hidden"
              autoPlay
              intervalMs={2500}
            />
                       
           {/* Reviews section */}
            <div className="p-4 mt-10 border bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Reviews</h2>
                <span className="px-2 py-1 text-xs rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200">
                  {reviews.length} total
                </span>
              </div>

              {/* Add review card */}
              <div className="p-4 mt-4 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-white/5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Rating</span>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="px-2 py-1 text-sm bg-white border rounded-lg border-slate-200 dark:border-white/10 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100"
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {r} ⭐
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    disabled={posting}
                    onClick={submitReview}
                    className="px-4 py-2 text-sm font-medium text-white bg-black sm:ml-auto rounded-xl dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-60"
                  >
                    {posting ? "Posting..." : "Post review"}
                  </button>
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your experience..."
                  className="w-full p-3 mt-3 text-sm bg-white border outline-none rounded-xl border-slate-200 dark:border-white/10 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500"
                />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Tip: Only customers who purchased & received this medicine can review.
                </p>
              </div>

              {/* Reviews list */}
              <div className="mt-5 space-y-3">
                {reviews.length === 0 ? (
                  <div className="p-4 text-sm border border-dashed text-slate-600 dark:text-slate-300 border-slate-300 dark:border-white/15 rounded-2xl">
                    No reviews yet. Be the first to review!
                  </div>
                ) : (
                  reviews.map((r) => {
                    const userName = r.user?.name || r.user?.email?.split("@")?.[0] || "User";
                    const avatarRaw = r.user?.avatar || ""; 
                    const avatar = avatarRaw
                      ? avatarRaw.startsWith("http")
                        ? avatarRaw
                        : `${assetBase}${avatarRaw}`
                      : "";

                    const initial = userName.slice(0, 1).toUpperCase();

                    return (
                      <div
                        key={r.id}
                        className="flex gap-3 p-4 bg-white border rounded-2xl border-slate-200 dark:border-white/10 dark:bg-white/5"
                      >
                        {/* Avatar */}
                        {avatar ? (
                          <img
                            src={avatar}
                            alt={userName}
                            className="object-cover w-10 h-10 border rounded-full border-slate-200 dark:border-white/10"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-10 h-10 font-semibold rounded-full bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-100">
                            {initial}
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {userName}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                ⭐ {r.rating} • {new Date(r.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            <span className="text-[11px] px-2 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200">
                              Verified
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                            {r.comment || "(No comment)"}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-4">
            <div className="p-6 border bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10 rounded-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {m.name}
                  </h1>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Brand: <span className="font-medium">{m.brand}</span> • Manufacturer:{" "}
                    <span className="font-medium">{m.manufacturer}</span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Category: <span className="font-medium">{m.category?.name || m.categoryId}</span>
                  </p>
                </div>
                <Badge text={m.form} />
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  tk {m.price}
                </div>
                <div className="px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200">
                  SKU: {m.id.slice(0, 8)}...
                </div>
              </div>

              {/* CTA buttons */}
              <div className="grid grid-cols-1 gap-3 mt-5 sm:grid-cols-2">
                <button
                  disabled={!canBuy}
                  onClick={gotoCart}
                  className="w-full py-3 text-sm font-medium bg-white border rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>

                <button
                  disabled={!canBuy}
                  onClick={gotoCheckout}
                 className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
                >
                  Order Now
                </button>
              </div>

              {/* Description */}
              <div className="p-4 mt-5 border rounded-2xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10">
                <div className="mb-2 font-semibold text-slate-900 dark:text-slate-100">Description</div>
                <p className="text-sm whitespace-pre-line text-slate-700 dark:text-slate-200">
                  {m.description}
                </p>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
