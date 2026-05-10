"use client";

import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ChevronLeft, ChevronRight } from "lucide-react";


export default function ReviewsGrid({ reviews }: { reviews: any[] }) {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  const items = useMemo(() => (Array.isArray(reviews) ? reviews : []), [reviews]);
  const [index, setIndex] = useState(0);

  const assetBase = (process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "").replace(/\/$/, "");
  const toUrl = (raw?: string) => {
    const v = (raw ?? "").trim();
    if (!v) return "/avatar.png";
    if (v.startsWith("http")) return v;
    const path = v.startsWith("/") ? v : `/${v}`;
    return assetBase ? `${assetBase}${path}` : path;
  };

  useEffect(() => {
    if (index >= items.length) setIndex(0);
  }, [items.length, index]);

  const prev = () => {
    if (!items.length) return;
    setIndex((i) => (i - 1 + items.length) % items.length);
  };

  const next = () => {
    if (!items.length) return;
    setIndex((i) => (i + 1) % items.length);
  };

  if (!items.length) {
    return (
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-slate-900">What customers say</h2>
          <p className="mt-1 text-sm text-slate-500">No reviews yet.</p>
        </div>
      </section>
    );
  }

  const active = items[index];

  const name = active?.user?.name || active?.customer?.name || active?.name || "Anonymous";
  const title =
    active?.medicine?.name || active?.product?.name || active?.title || "Verified Customer";
  const message =
    active?.comment || active?.review || active?.message || active?.text || "Great service!";

  return (
    <section className="relative px-4 py-16 overflow-hidden text-black sm:py-20">
      <div data-aos="fade-up" className="relative max-w-5xl mx-auto text-center">
        
       <div data-aos="fade-up" data-aos-delay="150" className="relative max-w-3xl mx-auto">
          <button
            onClick={prev}
            type="button"
            aria-label="Previous review"
            className="absolute z-10 flex items-center justify-center w-10 h-10 transition -translate-y-1/2 bg-white border border-gray-200 rounded-full shadow -left-4 sm:-left-10 top-1/2 sm:h-12 sm:w-12 hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5 text-sky-950" />

          </button>

          <button
            onClick={next}
            type="button"
            aria-label="Next review"
            className="absolute z-10 flex items-center justify-center w-10 h-10 transition -translate-y-1/2 bg-white border border-gray-200 rounded-full shadow -right-4 sm:-right-10 top-1/2 sm:h-12 sm:w-12 hover:bg-gray-50"
          >
           <ChevronRight className="w-5 h-5 text-sky-950" />

          </button>

          <div className="px-6 py-10 sm:px-10">
            <div className="flex justify-center gap-3 mb-6">
              {items.slice(0, 7).map((t, i) => {
                const aRaw =
                  t?.user?.avatar || t?.customer?.avatar || t?.userImage || t?.avatar;
                const a = toUrl(aRaw);
                const isActive = i === index;

                return (
                  <button
                    key={t?.id ?? i}
                    onClick={() => setIndex(i)}
                    type="button"
                    className="focus:outline-none"
                    aria-label={`Go to review ${i + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a}
                      alt="avatar"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/avatar.png";
                      }}
                      className={[
                        "rounded-full object-cover transition-all duration-300 border transition-all duration-500 ease-out",
 
                        isActive
                          ? "h-14 w-14 sm:h-16 sm:w-16 border-pink-400 ring-4 ring-pink-400"
                          : "h-11 w-11 sm:h-12 sm:w-12 border-gray-200 opacity-70 hover:opacity-100",
                      ].join(" ")}
                    />
                  </button>
                );
              })}
            </div>

           <div
              key={index}
              data-aos="fade-up"
              data-aos-duration="450"
              className="my-10"
            >
              <p className="max-w-2xl mx-auto text-base italic leading-relaxed text-black sm:text-lg">
                “{message}”
              </p>

              <div className="mt-7">
                <p className="text-lg font-semibold">{name}</p>
                <p className="text-sm text-slate-600">{title}</p>
              </div>
            </div>


            <div className="flex justify-center gap-2 mt-8">
              {items.slice(0, 8).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to review dot ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={[
                    "h-2 w-2 rounded-full transition",
                    i === index ? "bg-pink-500 w-6" : "bg-gray-300 hover:bg-gray-400",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
