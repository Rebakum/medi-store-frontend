"use client";

import Link from "next/link";
import Image from "next/image";
import type { Medicine } from "@/lib/types";
import Badge from "./Badge";

const statusPill: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  OUT_OF_STOCK: "bg-rose-50 text-rose-700 border-rose-200",
  DISABLED: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function MedicineCard({ m }: { m: Medicine }) {
  if (!m) return null;

  const assetBase = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "";

  const image = m.images?.[0]
    ? m.images[0].startsWith("http")
      ? m.images[0]
      : `${assetBase}${m.images[0]}`
    : "/logo.png";

  const isOut = m.stock <= 0 || m.status === "OUT_OF_STOCK";

  return (
    <div className="transition bg-white border shadow-sm group rounded-2xl hover:-translate-y-1 hover:shadow-lg">
      <div className="relative overflow-hidden aspect-[4/3] bg-gray-50">
        <Image
          src={image}
          alt={m.name || "medicine"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition group-hover:scale-110"
          loading="lazy"
          placeholder="empty"
        />

        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 text-xs rounded-full border ${statusPill[m.status]}`}
          >
            {m.status}
          </span>
        </div>

        <div className="absolute px-2 py-1 text-xs bg-white rounded-full shadow top-3 right-3">
          Tk {m.price}
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold line-clamp-2">{m.name}</h3>

        <p className="text-xs text-gray-500">
          {isOut ? "Out of stock" : `Stock: ${m.stock}`}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/medicine/${m.id}`}
            className="px-3 py-2 text-sm text-center border rounded-xl"
          >
            Details
          </Link>

          <Link
            href={`/medicine/${m.id}`}
            className="px-3 py-2 text-sm text-center text-white rounded-xl bg-[#2EB0D9]"
          >
            Buy
          </Link>
        </div>
      </div>
    </div>
  );
}
