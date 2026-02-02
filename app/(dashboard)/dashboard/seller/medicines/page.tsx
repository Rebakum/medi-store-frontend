"use client";

import { useEffect, useState } from "react";
import { api, apiForm, qs } from "@/lib/api";
import type { Medicine } from "@/lib/types";

export default function SellerMedicinesPage() {
  const [items, setItems] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api<{ data: Medicine[] }>("/medicines");
      setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete medicine?")) return;
    await api(`/medicines/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold">My Medicines</h1>
        <a href="/dashboard/seller/medicines/CreateMedicine" className="px-4 py-2 border rounded">
          Add Medicine
        </a>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-white border">
          <thead>
            <tr className="border-b">
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id} className="border-b">
                <td>{m.name}</td>
                <td>৳ {m.price}</td>
                <td>{m.stock}</td>
                <td className="flex gap-2">
                  <a className="underline" href={`/dashboard/seller/medicines/${m.id}`}>
                    Edit
                  </a>
                  <button onClick={() => remove(m.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
