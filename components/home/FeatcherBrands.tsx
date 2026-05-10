"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiJson } from "@/lib/api";
import { buildAssetUrl } from "@/lib/buildAssetUrl";
import type { ApiResponse, Brand, Medicine } from "@/lib/types";

export default function FeaturedBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiJson<ApiResponse<Medicine[]>>("/medicines");
      const meds = res.data ?? [];

      const map = new Map<string, Brand>();

      meds.forEach((m) => {
        const key = (m.brand || "").trim();
        if (!key) return;

        const existing = map.get(key);

        if (!existing) {
          map.set(key, { brand: key, brandLogo: m.brandLogo ?? null });
        } else if (!existing.brandLogo && m.brandLogo) {
          map.set(key, { brand: key, brandLogo: m.brandLogo });
        }
      });

      setBrands(Array.from(map.values()).slice(0, 6));
    } catch (e) {
      console.error(e);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="px-4 py-16 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-[11px] font-semibold tracking-widest text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            <span className="h-2 w-2 rounded-full bg-[#2EB0D9]" />
            TRUSTED PARTNERS
          </div>

          <div className="flex flex-col items-center justify-center">
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Featured{" "}
              <span className="bg-gradient-to-r from-[#2EB0D9] to-[#38CAE4] bg-clip-text text-transparent">
                Brands
              </span>
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-center text-slate-600 dark:text-slate-300 sm:text-base">
              Explore the latest additions and customer favorites — verified products,
              clear details, and great pricing for everyday health needs.
            </p>
          </div>
          <div className="relative w-24 h-1 mx-auto mt-5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#2EB0D9] to-[#38CAE4]" />
            <div className="absolute inset-0 blur-md opacity-40 bg-[#2EB0D9]" />
          </div>
        </div>

        <div className="grid gap-4 mt-10 sm:grid-cols-2 lg:grid-cols-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-24 rounded-2xl bg-slate-100 animate-pulse dark:bg-white/5"
              />
            ))
          ) : brands.length === 0 ? (
            <div className="p-5 text-sm border border-dashed rounded-2xl text-slate-600 dark:text-slate-300 border-slate-300 dark:border-white/15">
              No brands yet
            </div>
          ) : (
            brands.map((b, i) => {
              const logoUrl = buildAssetUrl(b.brandLogo);
              const title = b.brand?.trim() || "Brand";

              return (
                <div
                  key={`${title}-${i}`}
                  className="flex justify-center flex-col items-center gap-4 w-full rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5"
                >
                  <div className="relative w-16 h-16 bg-white border place-items-center rounded-2xl border-slate-200 dark:border-white/10 dark:bg-slate-900/40">
                    {logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt={`${title} logo`}
                        fill
                        sizes="64px"
                        className="object-contain p-2"
                        loading="lazy"
                        placeholder="empty"
                      />
                    ) : (
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {title.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {title}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
