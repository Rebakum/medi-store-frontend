"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, BadgeCheck } from "lucide-react";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await api<{ data: any[] }>("/reviews");
        setReviews(res.data ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const items = useMemo(() => (Array.isArray(reviews) ? reviews : []), [reviews]);

  const assetBase = (process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "").replace(/\/$/, "");

  const toUrl = (raw?: string) => {
    const v = (raw ?? "").trim();
    if (!v) return "/avatar.png";
    if (v.startsWith("http")) return v;
    const path = v.startsWith("/") ? v : `/${v}`;
    return assetBase ? `${assetBase}${path}` : path;
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={`${star <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="w-64 h-12 mx-auto bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-[400px] mt-12 rounded-3xl bg-gray-100 animate-pulse" />
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="px-4 py-24">
        <div className="max-w-xl p-16 mx-auto text-center bg-white border border-gray-100 shadow-sm rounded-3xl">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-50 to-teal-50">
            <Quote size={36} className="text-cyan-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">No Reviews Yet</h3>
          <p className="mt-3 text-gray-500">Share your experience and help others make better choices!</p>
        </div>
      </section>
    );
  }

  const active = items[currentIndex];
  const rating = active?.rating || 5;
  const name = active?.user?.name || active?.customer?.name || active?.name || "Anonymous";
  const title = active?.medicine?.name || active?.product?.name || "MediStore Customer";
  const message = active?.comment || active?.review || active?.message || active?.text || "Amazing service!";
  const avatarUrl = toUrl(active?.user?.avatar || active?.customer?.avatar || active?.avatar);
  const userInitial = name.charAt(0).toUpperCase();
  const avgRating = (items.reduce((acc, r) => acc + (r.rating || 5), 0) / items.length).toFixed(1);

  return (
    <section className="relative px-4 py-24 overflow-hidden">
      <div className="absolute inset-0 " />      

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-[11px] font-semibold tracking-widest text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-[#2EB0D9]" />
                    Testimonials
                </div>
         
          <h2 className="text-4xl font-black text-gray-900 sm:text-5xl">
            Loved by <span className="text-transparent bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text">Thousands</span>
          </h2>
          <p>Real feedback from verified buyers — honest experiences, trusted products, and reliable service that helps you shop with confidence.</p>
           <div className="relative w-24 h-1 mx-auto mt-5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-linear-to-r from-[#2EB0D9] to-[#38CAE4]" />
                <div className="absolute inset-0 blur-md opacity-40 bg-[#2EB0D9]" />
              </div>
        </motion.div>

        <div className="relative">
          <button
            onClick={prev}
            className="absolute left-0 z-10 flex items-center justify-center transition-all duration-300 -translate-x-4 -translate-y-1/2 bg-white border border-gray-100 rounded-full shadow-lg top-1/2 md:-translate-x-16 w-14 h-14 shadow-gray-200/50 hover:shadow-xl hover:scale-110 hover:border-cyan-300 group"
          >
            <ChevronLeft size={24} className="text-gray-400 transition-colors group-hover:text-cyan-500" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 z-10 flex items-center justify-center transition-all duration-300 translate-x-4 -translate-y-1/2 bg-white border border-gray-100 rounded-full shadow-lg top-1/2 md:translate-x-16 w-14 h-14 shadow-gray-200/50 hover:shadow-xl hover:scale-110 hover:border-cyan-300 group"
          >
            <ChevronRight size={24} className="text-gray-400 transition-colors group-hover:text-cyan-500" />
          </button>

          <div className="px-8 overflow-hidden shadow-xl md:px-20 hover:shadow-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 100 : -100, scale: 0.95 }),
                  center: { opacity: 1, x: 0, scale: 1 },
                  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -100 : 100, scale: 0.95 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative"
              >
                <div className="overflow-hidden bg-white border border-gray-100 rounded-3xl shadow-gray-100/80">
                  <div className="" />

                  <div className="px-8 pt-12 pb-10 sm:px-12">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <div className="relative overflow-hidden rounded-full shadow-xl w-28 h-28 ring-4 ring-cyan-100">
                          {avatarUrl && avatarUrl !== "/avatar.png" ? (
                            <Image
                              src={avatarUrl}
                              alt={name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-cyan-400 to-teal-500">
                              <span className="text-4xl font-bold text-white">{userInitial}</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute flex items-center justify-center w-10 h-10 bg-green-500 border-4 border-white rounded-full shadow-lg -bottom-2 -right-2">
                          <BadgeCheck size={18} className="text-white" />
                        </div>
                      </div>

                      {renderStars(rating)}

                      <div className="max-w-lg mt-6 text-center">
                        <Quote size={32} className="inline-block mb-2 text-cyan-200" />
                        <p className="text-lg leading-relaxed text-gray-600 sm:text-xl">
                          {message}
                        </p>
                      </div>

                      <div className="mt-8 text-center">
                        <h4 className="text-lg font-bold text-gray-900">{name}</h4>
                        <p className="mt-1 text-sm text-gray-500">{title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-2 mt-10">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  idx === currentIndex
                    ? "w-8 bg-gradient-to-r from-cyan-500 to-teal-500 shadow-lg shadow-cyan-300/50"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mt-8">
            {items.slice(0, 7).map((item, idx) => {
              const thumbAvatar = toUrl(item?.user?.avatar || item?.customer?.avatar || item?.avatar);
              const thumbName = item?.user?.name || item?.customer?.name || "User";
              const thumbInitial = thumbName.charAt(0).toUpperCase();

              return (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`relative rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "ring-2 ring-cyan-400 ring-offset-2 scale-110"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                    idx === currentIndex ? "border-cyan-400" : "border-gray-200"
                  }`}>
                    {thumbAvatar && thumbAvatar !== "/avatar.png" ? (
                      <Image src={thumbAvatar} alt={thumbName} fill className="object-cover rounded-full " />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-cyan-400 to-teal-500">
                        <span className="text-sm font-semibold text-white">{thumbInitial}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
