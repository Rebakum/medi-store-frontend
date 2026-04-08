"use client";

import { useRouter } from "next/navigation";
import useCart from "@/features/cart/useCart";

export default function CartPage() {
  const { items, total, updateQty, remove, clear } = useCart();
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Cart</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">Cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {/* Cart Items */}
          {items.map((x) => (
            <div
              key={x.id}
              className="flex items-center gap-4 p-3 border rounded-lg"
            >
              <img
                src={x.image}
                alt={x.name}
                className="object-cover w-20 h-20 border rounded-md"
              />

              <div className="flex-1">
                <p className="font-medium">{x.name}</p>
                <p className="text-sm text-gray-500">Tk: {x.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={x.qty}
                  className="w-20 px-2 py-1 border rounded"
                  onChange={(e) =>
                    updateQty(x.id, Number(e.target.value))
                  }
                />
                <button
                  className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#d92e2e] hover:bg-[#e43838] transition shadow-sm"
                  onClick={() => remove(x.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <p className="text-lg font-semibold">Total: TK {total}</p>
            <button
              className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#f50606] hover:bg-[#e43838] transition shadow-sm"
              onClick={clear}
            >
              Clear
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-start gap-3 mt-4">
            {/* Continue Buy */}
            <button
              onClick={() => router.push("/categories")}
              className="
                inline-flex items-center gap-2
                rounded-xl px-4 py-2.5
                text-sm font-semibold
                text-[#2EB0D9]
                bg-[#2EB0D9]/10
                hover:bg-[#2EB0D9]/20
                border border-[#2EB0D9]/20
                transition-all duration-200
                hover:scale-[1.03]
                active:scale-[0.97]
                shadow-sm
              "
            >
              🛒 Continue Buy Medicine
            </button>

            {/* Order Now */}
            <button
              onClick={() => router.push("/dashboard/customer/checkout")}
              className="
                inline-flex items-center gap-2
                rounded-xl px-5 py-2.5
                text-sm font-semibold text-white
                bg-gradient-to-r from-[#2EB0D9] to-[#38CAE4]
                hover:from-[#38CAE4] hover:to-[#2EB0D9]
                transition-all duration-200
                hover:scale-[1.03]
                active:scale-[0.97]
                shadow-md
              "
            >
              ⚡ Order Now
            </button>
            </div>

        </div>
      )}
    </div>
  );
}
