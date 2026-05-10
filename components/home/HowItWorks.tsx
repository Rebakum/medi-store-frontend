"use client";

import { Search, ShoppingBag, Truck, ShieldCheck } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    title: "Search Medicines",
    desc: "Find medicines quickly using categories or search with clear product details.",
    icon: Search,
  },
  {
    title: "Add to Cart",
    desc: "Choose quantity and add products to your cart in one click.",
    icon: ShoppingBag,
  },
  {
    title: "Fast Delivery",
    desc: "We deliver safely with secure packaging and real-time order updates.",
    icon: Truck,
  },
  {
    title: "Verified & Safe",
    desc: "Authentic medicines from trusted brands with quality checks.",
    icon: ShieldCheck,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative px-4 py-10 bg-white dark:bg-slate-950">
      {/* soft glow bg */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background:radial-gradient(700px_circle_at_50%_0%,rgba(46,176,217,0.18),transparent_60%)]" />

      <div className="mx-auto max-w-7xl">
        {/* header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-[11px] font-semibold tracking-widest text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            <span className="h-2 w-2 rounded-full bg-[#2EB0D9]" />
            HOW IT WORKS
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Order in{" "}
            <span className="bg-gradient-to-r from-[#2EB0D9] to-[#38CAE4] bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>

          <p className="max-w-2xl mx-auto mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Shop confidently with verified products, easy checkout, and reliable
            delivery — designed for your everyday health needs.
          </p>

          <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#2EB0D9] to-[#38CAE4]" />
        </div>

        {/* steps */}
        <div className="grid gap-4 mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5"
              >
                {/* number */}
                <div className="absolute text-3xl font-black right-4 top-4 text-slate-200 dark:text-white/10">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {/* icon */}
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#2EB0D9]/10 text-[#2EB0D9]">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {s.desc}
                </p>

                {/* hover bar */}
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#2EB0D9] to-[#38CAE4] transition-all group-hover:w-2/3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* bottom CTA */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <Link
            href="/shop"
            className="rounded-xl bg-[#2EB0D9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#38CAE4]"
          >
            Start Shopping
          </Link>

          <Link
            href="/categories"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
          >
            Browse Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
