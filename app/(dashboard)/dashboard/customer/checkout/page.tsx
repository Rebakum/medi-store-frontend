"use client";

import { useState } from "react";
import RoleGuard from "@/components/common/role-guard";
import useCart from "@/features/cart/useCart";
import { apiJson } from "@/lib/api";
import { useRouter } from "next/navigation";

type ApiOne<T> = { success: boolean; message: string; data: T };

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD">("COD");

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  const onCheckout = async () => {
    setErr("");
    if (!items.length) return setErr("Cart is empty");
    if (!address.trim()) return setErr("Address required");
    if (!phone.trim()) return setErr("Phone required");

    setSaving(true);
    try {
      // backend usually expects items with medicineId + quantity
      const payload = {
        address,
        phone,
        paymentMethod,
        items: items.map((it) => ({
          medicineId: it.id,
          quantity: it.qty,
        })),
      };

      await apiJson<ApiOne<any>>("/orders/checkout", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      clear();
      router.push("/dashboard/customer/orders");
    } catch (e: any) {
      setErr(e?.message || "Checkout failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RoleGuard allow={["CUSTOMER", "ADMIN"]}>
      <div className="max-w-3xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Checkout</h1>

        {err && <div className="p-2 text-sm text-red-600 border rounded">{err}</div>}

        <div className="p-4 space-y-3 bg-white border rounded-xl">
          <div className="font-medium">Order Summary</div>
          <div className="text-sm text-gray-600">{items.length} item(s)</div>
          <div className="text-lg font-semibold">Total: ৳ {total}</div>
        </div>

        <div className="p-4 space-y-3 bg-white border rounded-xl">
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="Delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <select
            className="w-full px-3 py-2 border rounded"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
          >
            <option value="COD">Cash On Delivery</option>
          </select>

          <button
            disabled={saving}
            onClick={onCheckout}
            className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
          >
            {saving ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </div>
    </RoleGuard>
  );
}
