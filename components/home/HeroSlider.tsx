"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, ShoppingBag, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { api } from "@/lib/api";

const PLACEHOLDER_SLIDES = [
  {
    id: "1",
    title: "Trusted Medicine",
    subtitle: "Quality healthcare products delivered to your doorstep",
    image: null,
    price: 0,
  },
  {
    id: "2",
    title: "Fast Delivery",
    subtitle: "Get your medicines within 24 hours",
    image: null,
    price: 0,
  },
  {
    id: "3",
    title: "Expert Consultation",
    subtitle: "Connect with healthcare professionals",
    image: null,
    price: 0,
  },
];

export default function HeroSlider() {
  const [slides, setSlides] = useState<any[]>(PLACEHOLDER_SLIDES);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fetchError, setFetchError] = useState(false);
  const debounced = useDebounce(q, 300);

  const getImageUrl = useCallback((img: string | null | undefined) => {
    if (!img) return "/logo.png";
    if (img.startsWith("http")) return img;
    const base = process.env.NEXT_PUBLIC_ASSET_BASE_URL || "https://medi-store-server-phi.vercel.app";
    const path = img.startsWith("/") ? img : `/${img}`;
    return `${base}${path}`;
  }, []);

  const searchHref = useMemo(() => {
    const s = q.trim();
    return s ? `/shop?search=${encodeURIComponent(s)}` : "/shop";
  }, [q]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setFetchError(false);
        const res = await api<{ data: any[] }>("/medicines/featured");
        
        if (isMounted && res.data?.length > 0) {
          const formatted = res.data.slice(0, 5).map((item: any) => ({
            id: item.id,
            title: item.name,
            subtitle: item.description?.slice(0, 100) + "...",
            image: item.images?.[0] || null,
            price: item.price,
          }));
          
          setSlides(formatted);
        } else if (isMounted) {
          setSlides(PLACEHOLDER_SLIDES);
        }
      } catch (err) {
        console.warn("Failed to fetch featured medicines:", err);
        if (isMounted) {
          setFetchError(true);
          setSlides(PLACEHOLDER_SLIDES);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!debounced) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await api<{ data: any[] }>(
          `/medicines/suggestions?search=${debounced}`,
          { signal: controller.signal }
        );
        setSuggestions((res.data || []).slice(0, 5));
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setSuggestions([]);
        }
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [debounced]);

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentIndex] || slides[0];
  const imageUrl = getImageUrl(current.image);

  if (loading) {
    return (
      <section className="relative px-4 py-6 mx-auto max-w-7xl">
        <div className="h-[500px] rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse">
          <div className="flex items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (!slides.length) return null;

  return (
    <section className="relative px-4 py-6 mx-auto max-w-7xl">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl shadow-slate-900/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="relative min-h-[500px] lg:min-h-[550px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col lg:flex-row items-center justify-center px-8 lg:px-16 py-12 gap-8 lg:gap-16"
            >
              <div className="flex-1 text-center lg:text-left space-y-6 z-10 max-w-xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight">
                  {current.title}
                </h1>
                <p className="text-lg sm:text-xl text-slate-400 max-w-md mx-auto lg:mx-0">
                  {current.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <Link
                    href={`/medicine/${current.id}`}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-full hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 text-lg flex items-center gap-2"
                  >
                    Shop Now <ArrowRight size={20} />
                  </Link>
                  <Link
                    href="/shop"
                    className="px-8 py-4 border-2 border-slate-600 text-white font-semibold rounded-full hover:bg-slate-800 hover:border-cyan-400 transition-all duration-300 text-lg"
                  >
                    View All
                  </Link>
                </div>

                <div className="relative max-w-lg mx-auto lg:mx-0 mt-6">
                  <div className="flex items-center bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden">
                    <Search className="ml-4 text-slate-400" size={22} />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search medicines..."
                      className="w-full h-16 px-4 text-white bg-transparent outline-none placeholder:text-slate-500 text-base"
                    />
                    <Link
                      href={searchHref}
                      className="mr-2 p-3 bg-cyan-500 rounded-xl hover:bg-cyan-400 transition-colors"
                    >
                      <ShoppingBag size={20} className="text-white" />
                    </Link>
                  </div>

                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden z-50 shadow-xl"
                      >
                        {suggestions.map((item: any) => (
                          <Link
                            key={item.id}
                            href={`/medicine/${item.id}`}
                            className="flex items-center gap-4 p-4 hover:bg-slate-700/50 transition-colors"
                          >
                            {item.images?.[0] && (
                              <div className="relative w-16 h-16 bg-slate-700 rounded-xl overflow-hidden flex-shrink-0">
                                <img
                                  src={getImageUrl(item.images[0])}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-medium text-white truncate">{item.name}</p>
                              <p className="text-sm text-cyan-400">৳{item.price}</p>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center justify-center w-full max-w-md lg:max-w-lg xl:max-w-xl aspect-square z-10">
                <div className="relative w-full h-full max-w-[400px] max-h-[400px] lg:max-w-[500px] lg:max-h-[500px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-3xl blur-3xl animate-pulse" />
                  {imageUrl ? (
                    <div className="relative w-full h-full bg-slate-800/50 rounded-3xl overflow-hidden flex items-center justify-center p-4">
                      <img
                        src={imageUrl}
                        alt={current.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-3xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center">
                      <span className="text-[120px] sm:text-[150px] lg:text-[200px] font-black text-white/10">{current.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-slate-800/50 backdrop-blur border border-slate-700 hover:bg-slate-700/80 hover:border-cyan-400 transition-all duration-300 flex items-center justify-center"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-slate-800/50 backdrop-blur border border-slate-700 hover:bg-slate-700/80 hover:border-cyan-400 transition-all duration-300 flex items-center justify-center"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 pb-6 z-20 relative">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-3 rounded-full transition-all duration-500 ${
                idx === currentIndex
                  ? "w-10 bg-gradient-to-r from-cyan-400 to-teal-400 shadow-lg shadow-cyan-400/30"
                  : "w-3 bg-slate-600 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
