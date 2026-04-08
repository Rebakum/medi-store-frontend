"use client";

import Link from "next/link";
import type { Medicine } from "@/lib/types";
import Badge from "./Badge";

const statusPill: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  OUT_OF_STOCK: "bg-rose-50 text-rose-700 border-rose-200",
  DISABLED: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function MedicineCard({ m }: { m: Medicine }) {
  const assetBase = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "";

  const first = m.images?.[0]?.trim();
  const src = first
    ? first.startsWith("http")
      ? first
      : `${assetBase}${first}`
    : "/placeholder.png";

  const brandLogoSrc = m.brandLogo
    ? m.brandLogo.startsWith("http")
      ? m.brandLogo
      : `${assetBase}${m.brandLogo}`
    : "";

  const isOut = m.stock <= 0 || m.status === "OUT_OF_STOCK";
  const isDisabled = m.status === "DISABLED";

  const stockText = isDisabled ? "Disabled" : isOut ? "Out of stock" : `Stock: ${m.stock}`;
  const statusText = isDisabled ? "DISABLED" : isOut ? "OUT OF STOCK" : "ACTIVE";

  return (
    <div
      className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition
                 hover:-translate-y-0.5 hover:shadow-lg hover:border-sky-200"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-50">
        <div className="aspect-[4/3] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={m.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
          />
        </div>

        {/* gradient overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/15 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute flex items-center gap-2 left-3 top-3">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold backdrop-blur
            ${statusPill[m.status] ?? statusPill.ACTIVE}`}
          >
            {statusText}
          </span>

          <Badge text={m.form} />
        </div>

        {/* Price chip */}
        <div className="absolute px-3 py-1 text-xs font-semibold rounded-full shadow-sm right-3 top-3 bg-white/95 text-slate-800 ring-1 ring-slate-200">
          Tk {m.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-[15px] font-semibold text-slate-900">
            {m.name}
          </h3>

          {/* Brand row with logo */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            {brandLogoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brandLogoSrc}
                alt={`${m.brand} logo`}
                className="object-contain w-4 h-4 bg-white border rounded"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}

            <span className="font-medium">{m.brand}</span>
            <span className="opacity-60">•</span>
            <span>{m.manufacturer}</span>
          </div>
        </div>

        {/* Stock + category */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">{stockText}</p>

          {m.category?.name ? (
            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700 ring-1 ring-sky-100">
              {m.category.name}
            </span>
          ) : null}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/shop/${m.id}`}
            className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium transition border rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Details
          </Link>

          <Link
            href={`/shop/${m.id}`}
            className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
          >
            Buy now
          </Link>
        </div>
      </div>
    </div>
  );
}
