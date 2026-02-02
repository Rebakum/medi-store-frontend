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
                <p className="text-sm text-gray-500">৳ {x.price}</p>
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
                  className="px-3 py-1 border rounded"
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
              className="px-3 py-1 border rounded"
              onClick={clear}
            >
              Clear
            </button>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              className="w-full py-3 border rounded-xl hover:bg-gray-50"
              onClick={() =>
                router.push("/categories")
              }
            >
              Continue buy Medicine
            </button>

            <button
              className="w-full py-3 text-white bg-black rounded-xl hover:bg-gray-800"
              onClick={() =>
                router.push("/dashboard/customer/checkout")
              }
            >
              Order Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
