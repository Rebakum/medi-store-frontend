// Hero.tsx (or app/page.tsx)
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-[420px] w-[420px] rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-[420px] w-[420px] rounded-full bg-pink-500/15 blur-3xl" />
        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              New • Launch-ready UI for Next.js + Tailwind
            </div>

            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Build beautiful products with a{" "}
              <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
                Hero + Gradient CTA
              </span>
              .
            </h1>

            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/70">
              Modern bento layout, glass cards, soft glow background—perfect for
              SaaS, portfolio, e-commerce, and admin dashboards.
            </p>

            {/* CTA Row */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {/* Primary gradient button */}
              <Link
                href="#get-started"
                className="group relative inline-flex items-center justify-center rounded-full p-[1.5px]"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff8a05] via-[#ff5478] to-[#ff00c6] opacity-90 blur-[10px] transition-opacity group-hover:opacity-100" />
                <span className="relative inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white ring-1 ring-white/10 transition-transform duration-200 group-hover:-translate-y-0.5">
                  Get Started
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>

              {/* Secondary */}
              <Link
                href="#demo"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/10"
              >
                View Demo
              </Link>

              {/* Tiny trust */}
              <div className="ml-1 text-xs text-white/55">
                No credit card • Setup in 5 minutes
              </div>
            </div>

            {/* Mini stats */}
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/70">
              <div>
                <div className="text-white">⚡ Fast</div>
                <div className="text-white/55">Next.js App Router</div>
              </div>
              <div>
                <div className="text-white">🎨 Clean</div>
                <div className="text-white/55">Tailwind utility UI</div>
              </div>
              <div>
                <div className="text-white">🧩 Flexible</div>
                <div className="text-white/55">Reusable components</div>
              </div>
            </div>
          </div>

          {/* Right: Bento / Preview */}
          <div className="relative">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="text-sm font-medium text-white">Bento Card</div>
                <p className="mt-1 text-sm text-white/65">
                  Glass + subtle border + blur for modern look.
                </p>
                <div className="mt-4 h-24 rounded-xl bg-gradient-to-br from-white/10 to-white/0" />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="text-sm font-medium text-white">Gradient CTA</div>
                <p className="mt-1 text-sm text-white/65">
                  Your preferred gradient: orange → pink → fuchsia.
                </p>
                <div className="mt-4 h-24 rounded-xl bg-gradient-to-r from-[#ff8a05] via-[#ff5478] to-[#ff00c6] opacity-80" />
              </div>

              <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-white">Live Preview</div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">
                    99.9% uptime
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/65">
                  Add your product screenshot / dashboard image here.
                </p>
                <div className="mt-4 h-40 rounded-xl bg-gradient-to-br from-white/10 to-white/0" />
              </div>
            </div>

            {/* Corner badge */}
            <div className="absolute -right-3 -top-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 backdrop-blur">
              ✨ Premium feel
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
