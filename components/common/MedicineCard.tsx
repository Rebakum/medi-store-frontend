"use client";

import Link from "next/link";
import type { Medicine } from "@/lib/types";
import Badge from "./Badge";

export default function MedicineCard({ m }: { m: Medicine }) {
  const img = m.images?.[0];

  const stockText =
    m.status === "DISABLED"
      ? "Disabled"
      : m.stock <= 0 || m.status === "OUT_OF_STOCK"
      ? "Out of stock"
      : `Stock: ${m.stock}`;

  return (
    <div className="overflow-hidden transition bg-white border rounded-xl hover:shadow-sm">
      <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={m.name} className="object-cover w-full h-full" />
        ) : (
          <div className="text-sm text-gray-400">No image</div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium leading-tight line-clamp-2">{m.name}</h3>
          <Badge text={m.form} />
        </div>

        <div className="text-sm text-gray-600">
          {m.brand} • {m.manufacturer}
        </div>

        <div className="flex items-center justify-between">
          <div className="font-semibold">৳ {m.price}</div>
          <div className="text-xs text-gray-500">{stockText}</div>
        </div>

        <Link
          href={`/shop/${m.id}`}
          className="inline-flex justify-center w-full py-2 text-sm border rounded-lg hover:bg-gray-50"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
