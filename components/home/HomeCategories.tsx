"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

type Category = {
  id: string;
  name: string;
  image?: string;
};

export default function HomeCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const assetBase = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "";

  const toUrl = (raw?: string) => {
    if (!raw) return "/logo.png";
    if (raw.startsWith("http")) return raw;
    return `${assetBase}${raw}`;
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await api<{ data: Category[] }>("/categories");
        setCategories(res.data.slice(0, 6));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <section className="px-4 py-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-12 mx-auto max-w-7xl">
      <div className="flex flex-col items-center my-10 space-y-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-[11px] font-semibold tracking-widest text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
          <span className="h-2 w-2 rounded-full bg-[#2EB0D9]" />
          SHOW THIS CATEGORY
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Explore Our <span className="text-[#2EB0D9]">Medicine Categories</span>
        </h1>

        <p className="max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
          Discover a wide range of healthcare products organized by category — from
          daily essentials and vitamins to specialized medicines designed for your
          everyday wellness.
        </p>

        <div className="relative w-24 h-1 mx-auto mt-5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#2EB0D9] to-[#38CAE4]" />
          <div className="absolute inset-0 blur-md opacity-40 bg-[#2EB0D9]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{
              scale: 1.05,
              rotateX: 8,
              rotateY: -8,
              boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
            }}
            className="perspective-1000"
          >
            <Link
              href={`/shop?category=${c.id}`}
              className="block overflow-hidden transition bg-white border rounded-xl transform-gpu"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="relative overflow-hidden aspect-square bg-gray-50">
                <Image
                  src={toUrl(c.image)}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition duration-300 group-hover:scale-110"
                  loading="lazy"
                  placeholder="empty"
                />
              </div>

              <div className="p-3 text-center">
                <p className="text-sm font-medium">{c.name}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Link
          href="/shop"
          className="px-5 py-2 rounded-xl text-white bg-[#2EB0D9] hover:bg-[#38CAE4] transition"
        >
          View All
        </Link>
      </div>
    </section>
  );
}
