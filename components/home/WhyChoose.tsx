"use client";

import Image from "next/image";
import { Clock3, ShieldCheck, Truck, Smile } from "lucide-react";

// change this image path to your own (public folder)
import whyImg from "@/public/chose.jpg";

const features = [
  {
    icon: Clock3,
    title: "Save Time & Shop Faster",
    desc: "Find medicines quickly with smart categories, search, and clean product details.",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  {
    icon: ShieldCheck,
    title: "Verified & Trusted Products",
    desc: "We focus on quality, authenticity, and transparent information you can trust.",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    icon: Truck,
    title: "Fast Delivery & Easy Tracking",
    desc: "Smooth checkout, quick delivery updates, and a reliable shopping experience.",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    icon: Smile,
    title: "Comfortable Shopping Experience",
    desc: "Simple UI, helpful support, and secure payments — made for everyday needs.",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-10 ">
      <div className="px-4 mx-auto max-w-7xl">
        {/* wrapper */}
        <div className="p-6 border rounded-3xl bg-linear-to-br from-sky-50 to-white sm:p-10">
          {/* heading */}
         <div className="flex flex-col items-center mb-10 space-y-3 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-[11px] font-semibold tracking-widest text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-[#2EB0D9]" />
                    WHY CHOOSE US
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                    Why Choose <span className="text-[#2EB0D9]">Us?</span>
                </h2>

                <p className="max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
                    Discover why customers trust MediStore — fast delivery, verified products,
                    and a smooth healthcare shopping experience built for your daily needs.
                </p>

                 {/* accent line + glow */}
              <div className="relative w-24 h-1 mx-auto mt-5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-linear-to-r from-[#2EB0D9] to-[#38CAE4]" />
                <div className="absolute inset-0 blur-md opacity-40 bg-[#2EB0D9]" />
              </div>
                </div>


          {/* content */}
          <div className="grid items-center gap-8 mt-10 lg:grid-cols-2 lg:gap-10">
            {/* left cards */}
            <div className="space-y-4">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="p-4 transition border shadow-sm rounded-2xl bg-white/80 backdrop-blur hover:shadow-md sm:p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={[
                          "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                          f.iconBg,
                        ].join(" ")}
                      >
                        <Icon className={["h-5 w-5", f.iconColor].join(" ")} />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                          {f.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-500">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* right image */}
            <div className="relative">
              {/* frame */}
              <div className="absolute inset-0 rounded-[28px] bg-[#2EB0D9]/15" />
              <div className="relative overflow-hidden rounded-[28px] border bg-white p-2 shadow-sm">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px]">
                  <Image
                    src={whyImg}
                    alt="Why choose us"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 80vw"
                    priority={false}
                  />
                </div>

                {/* small accent corners */}
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#2EB0D9]/20 blur-2xl" />
                <div className="absolute w-24 h-24 rounded-full pointer-events-none -bottom-6 -left-6 bg-sky-200/50 blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
