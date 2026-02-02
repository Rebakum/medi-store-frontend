"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Medicine } from "@/lib/types";
import Badge from "@/components/common/Badge";
import { useRouter } from "next/navigation";
import useCart from "@/features/cart/useCart";



export default function MedicineDetailsPage() {
    const { add } = useCart();
const router = useRouter();

  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [m, setM] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await api<{ data: Medicine }>(`/medicines/${id}`);
        setM(res.data);
      } catch (e) {
        console.error(e);
        setM(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!m) return <div className="p-6">Not found</div>;

  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
      <div className="overflow-hidden bg-white border rounded-xl">
        <div className="aspect-[4/3] bg-gray-50">
          <img src={m.images?.[0] || ""} alt={m.name} className="object-cover w-full h-full" />
        </div>
        <div className="p-4 text-sm text-gray-600">
          {m.images?.length ? `${m.images.length} image(s)` : "No image"}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold">{m.name}</h1>
          <Badge text={m.form} />
        </div>

        <div className="text-gray-600">
          <div>Brand: {m.brand}</div>
          <div>Manufacturer: {m.manufacturer}</div>
          <div>Category: {m.category?.name || m.categoryId}</div>
        </div>

        <div className="text-2xl font-bold">৳ {m.price}</div>

        <div className="text-sm text-gray-600">
          {m.status === "DISABLED"
            ? "This item is disabled"
            : m.stock <= 0 || m.status === "OUT_OF_STOCK"
            ? "Out of stock"
            : `In stock: ${m.stock}`}
        </div>

        <div className="p-4 bg-white border rounded-xl">
          <div className="mb-2 font-medium">Description</div>
          <p className="text-gray-700 whitespace-pre-line">{m.description}</p>
        </div>
        
            <div className="space-y-3">
            {/* Add to Cart */}
            <button
                className="w-full py-3 border rounded-xl hover:bg-gray-50"
                onClick={() => {
                add({
                    id: m.id,
                    name: m.name,
                    price: m.price,
                    image: m.images?.[0] || "/placeholder.png",
                });

                router.push("/dashboard/customer/cart");
                }}
            >
                Add to Cart
            </button>

            {/* Order Now */}
            <button
                className="w-full py-3 text-white bg-black rounded-xl hover:bg-gray-800"
                onClick={() => {
                add({
                    id: m.id,
                    name: m.name,
                    price: m.price,
                    image: m.images?.[0] || "/placeholder.png",
                });

                router.push("/dashboard/customer/checkout");
                }}
            >
                Order Now
            </button>
            </div>

      </div>
    </div>
  );
}
