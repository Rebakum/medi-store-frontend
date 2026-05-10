"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { isLoggedIn } from "@/lib/auth";


export default function AdminOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  

  useEffect(() => {
    if (!id) return;
    api<{ data: any }>(`/orders/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  if (!order) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-semibold">Order Details</h1>
      <p>Status: {order.status}</p>
      <p>Total: ৳ {order.total}</p>

      {order.items.map((i: any) => (
        <div key={i.id} className="p-2 border rounded">
          {i.medicine.name} × {i.quantity}
        </div>
      ))}
    </div>
  );
}
