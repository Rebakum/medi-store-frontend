"use client";

import useCart from "@/features/cart/useCart";
import Link from "next/link";

export type Medicine = {
  id: string;
  name: string;
  brand?: string | null;
  manufacturer?: string | null;
  price: number;
  stock?: number | null;
  images?: string[] | null;
};

export default function ProductCard({ p }: { p: Medicine }) {
     const { add } = useCart();
  const img = p.images?.[0]; // optional
  return (
    <div className="border rounded-xl p-3 hover:shadow-sm transition">
      <Link href={`/product/${p.id}`} className="block">
        <div className="aspect-[4/3] bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
          {img ? (
            
            <img src={img} alt={p.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-gray-400">No image</span>
          )}
        </div>

        <div className="mt-3 space-y-1">
          <p className="font-medium line-clamp-1">{p.name}</p>
          <p className="text-sm text-gray-500 line-clamp-1">
            {p.brand || p.manufacturer || "—"}
          </p>
          <p className="font-semibold mt-1">৳ {p.price}</p>
        </div>
      </Link>
      <button
        className="mt-3 w-full border rounded-lg py-2"
        onClick={() =>
          add({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.images?.[0] || undefined,
          })
        }
      >
        Add to Cart
      </button>
    </div>
  );
}
