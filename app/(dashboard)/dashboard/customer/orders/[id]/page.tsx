"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";
import { statusColor } from "@/lib/types";

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [draft, setDraft] = useState<
    Array<{ medicineId: string; name: string; quantity: number }>
  >([]);

  const fetchOrder = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api<{ data: Order }>(`/orders/${id}`);
      setOrder(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // init draft
  useEffect(() => {
    if (!order) return;
    setDraft(
      order.items.map((i) => ({
        medicineId: i.medicineId,
        name: i.medicine?.name ?? "Medicine",
        quantity: i.quantity,
      }))
    );
  }, [order]);

  const canEdit = order?.status === "PLACED";

  const changeQty = (medicineId: string, qty: number) => {
    setDraft((prev) =>
      prev.map((it) =>
        it.medicineId === medicineId
          ? { ...it, quantity: Math.max(1, qty || 1) }
          : it
      )
    );
  };

  const removeItem = (medicineId: string) => {
    setDraft((prev) => prev.filter((it) => it.medicineId !== medicineId));
  };

  const draftTotal = useMemo(() => {
    if (!order) return 0;
    const priceMap = new Map(order.items.map((i) => [i.medicineId, i.price]));
    return draft.reduce(
      (sum, it) => sum + (priceMap.get(it.medicineId) ?? 0) * it.quantity,
      0
    );
  }, [draft, order]);

  const saveUpdate = async () => {
    if (!order) return;

    setSaving(true);
    try {
      await api(`/orders/${order.id}/items`, {
        method: "PUT",
        body: {
          items: draft.map((d) => ({
            medicineId: d.medicineId,
            quantity: d.quantity,
          })),
        },
      });

      alert("Order updated");
      setEditing(false);
      fetchOrder();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">Order Details</h1>
          <p className="text-xs text-muted-foreground">{order.id}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => router.back()} className="px-3 py-2 text-sm border rounded-lg">
            Back
          </button>

          {canEdit && !editing && (
            <button onClick={() => setEditing(true)} className="px-3 py-2 text-sm border rounded-lg">
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="p-3 space-y-1 text-sm border rounded-xl">
        <p>
          Status:
          <span
            className={`px-2 py-1 rounded-full text-xs ${statusColor[order.status]}`}
          >
            {order.status}
          </span>

        </p>
        <p>Address: {order.address}</p>
        <p>Phone: {order.phone}</p>
      </div>

      {/* Items */}
      <div className="overflow-hidden border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th className="p-3 text-left">Medicine</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              {editing && <th />}
            </tr>
          </thead>

          <tbody>
            {(editing ? draft : order.items).map((row: any) => {
              const item = order.items.find((i) => i.medicineId === row.medicineId)!;

              const rawImg = item.medicine?.images?.[0];
              const img =
                rawImg && rawImg.startsWith("http")
                  ? rawImg
                  : rawImg
                  ? `${process.env.NEXT_PUBLIC_ASSET_BASE_URL}${rawImg}`
                  : null;

              return (
                <tr key={row.medicineId} className="border-t">
                  <td className="flex items-center gap-2 p-3">
                    <div className="w-10 h-10 overflow-hidden bg-gray-100 rounded">
                      {img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} className="object-cover w-full h-full" />
                      )}
                    </div>
                    {item.medicine?.name}
                  </td>

                  <td>
                    {editing ? (
                      <input
                        type="number"
                        value={row.quantity}
                        min={1}
                        onChange={(e) => changeQty(row.medicineId, Number(e.target.value))}
                        className="w-16 px-2 py-1 border rounded"
                      />
                    ) : (
                      row.quantity
                    )}
                  </td>

                  <td>Tk {item.price}</td>
                  <td>Tk {item.price * row.quantity}</td>

                  {editing && (
                    <td>
                      <button
                        onClick={() => removeItem(row.medicineId)}
                        className="px-2 py-1 text-xs border rounded"
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}

            <tr className="border-t bg-muted/20">
              <td colSpan={3} className="p-3 font-semibold">
                Total
              </td>
              <td className="font-semibold">
                Tk {editing ? draftTotal : order.total}
              </td>
              {editing && <td />}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Actions */}
      {editing && (
        <div className="flex gap-2">
          <button
            onClick={saveUpdate}
            disabled={saving}
            className="px-4 py-2 text-sm border rounded-lg"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={() => {
              setEditing(false);
              setDraft(
                order.items.map((i) => ({
                  medicineId: i.medicineId,
                  name: i.medicine?.name ?? "Medicine",
                  quantity: i.quantity,
                }))
              );
            }}
            className="px-4 py-2 text-sm border rounded-lg"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
