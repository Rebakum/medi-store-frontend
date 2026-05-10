"use client";

import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  Truck,
  ArrowRight,
  Sparkles,
  Stethoscope,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen px-6 py-20 mx-auto overflow-hidden max-w-7xl">

      {/* 🌈 BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 bg-[#2EB0D9]/20 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] bg-[#38CAE4]/20 blur-[120px]" />
      </div>

      {/* HERO */}
      <section className="relative p-10 border shadow-lg rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl">

        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold border rounded-full bg-white/70 dark:bg-white/10">
          <Sparkles className="w-4 h-4 text-[#2EB0D9]" />
          Trusted Digital Pharmacy
        </div>

        <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-6xl">
          About{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2EB0D9] via-[#38CAE4] to-[#7BE0F6]">
            MediStore
          </span>
        </h1>

        <p className="max-w-2xl mt-4 text-slate-600 dark:text-slate-300">
          A next-generation medical platform connecting patients, pharmacies,
          and verified sellers — with speed, trust, and transparency.
        </p>

        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-2xl bg-[#2EB0D9] hover:bg-[#38CAE4] transition hover:scale-105 shadow-md"
          >
            Explore Medicines <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition border rounded-2xl bg-white/70 hover:bg-white dark:bg-white/5"
          >
            Contact Support
          </Link>
        </div>
      </section>

      {/* MISSION + VALUES */}
      <section className="grid gap-6 mt-12 lg:grid-cols-3">

        {/* MISSION */}
        <div className="lg:col-span-2">
          <div className="h-full p-10 transition border rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl hover:shadow-lg">

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#2EB0D9]/10">
                <Stethoscope className="text-[#2EB0D9]" />
              </div>
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>

            <p className="mt-4 text-slate-600 dark:text-slate-300">
              To revolutionize healthcare access by making medicines available
              instantly, safely, and affordably through a modern digital system.
            </p>

            {/* VALUE GRID */}
            <div className="grid gap-4 mt-8 sm:grid-cols-2">

              <ValueCard
                icon={<ShieldCheck className="text-[#2EB0D9]" />}
                title="Trust & Safety"
                desc="Verified sellers and secure system"
              />

              <ValueCard
                icon={<Truck className="text-[#2EB0D9]" />}
                title="Fast Delivery"
                desc="Optimized logistics network"
              />

              <ValueCard
                icon={<Heart className="text-[#2EB0D9]" />}
                title="Care First"
                desc="Customer-focused experience"
              />

              <ValueCard
                icon={<Sparkles className="text-[#2EB0D9]" />}
                title="Modern Platform"
                desc="Real-time smart dashboard"
              />

            </div>
          </div>
        </div>

        {/* HIGHLIGHT PANEL */}
        <div className="p-8 border rounded-3xl bg-white/60 dark:bg-white/5 backdrop-blur-xl">

          <h3 className="text-xl font-bold">Why MediStore?</h3>

          <div className="mt-6 space-y-3">

            <Highlight text="Real-time order tracking" />
            <Highlight text="Verified medicine listings" />
            <Highlight text="Secure checkout system" />

          </div>

          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 mt-8 px-5 py-3 text-sm font-semibold text-white rounded-2xl bg-[#2EB0D9] hover:bg-[#38CAE4] transition hover:scale-105"
          >
            Start Shopping
          </Link>

        </div>
      </section>

      {/* STATS */}
      <section className="grid gap-4 mt-12 sm:grid-cols-3">

        <Stat number="1000+" label="Medicines" />
        <Stat number="500+" label="Customers" />
        <Stat number="50+" label="Verified Sellers" />

      </section>

      {/* FINAL CTA */}
      <section className="mt-12">
        <div className="p-10 text-center border rounded-3xl bg-gradient-to-r from-[#2EB0D9]/10 to-[#38CAE4]/10 backdrop-blur-xl">

          <h3 className="text-2xl font-bold">Ready to experience healthcare differently?</h3>

          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Fast, secure and modern medical shopping platform.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-6">

            <Link
              href="/shop"
              className="px-6 py-3 text-sm font-semibold text-white rounded-2xl bg-[#2EB0D9] hover:bg-[#38CAE4] transition"
            >
              Shop Now
            </Link>

            <Link
              href="/dashboard/customer/orders"
              className="px-6 py-3 text-sm font-semibold transition border rounded-2xl bg-white/70 hover:bg-white"
            >
              Track Orders
            </Link>

          </div>
        </div>
      </section>

    </main>
  );
}

/* COMPONENTS */

function ValueCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-4 border rounded-2xl bg-white/40 hover:bg-white/70 transition hover:scale-[1.02]">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white rounded-xl">{icon}</div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-xs text-slate-500">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function Highlight({ text }: { text: string }) {
  return (
    <div className="p-3 text-sm transition border rounded-xl bg-white/40 hover:bg-white">
      {text}
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="p-6 text-center transition border rounded-3xl bg-white/60 hover:shadow-md">
      <p className="text-3xl font-extrabold text-[#2EB0D9]">{number}</p>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
}