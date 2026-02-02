"use client";

import { useEffect, useState } from "react";
import { api, qs } from "@/lib/api";
import type { Medicine, Paginated, MedicineStatus } from "@/lib/types";
import Badge from "@/components/common/Badge";
import RoleGuard from "@/components/common/role-guard";

const STATUSES: MedicineStatus[] = ["ACTIVE", "OUT_OF_STOCK", "DISABLED"];

export default function AdminProductsPage() {
  const [items, setItems] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      // admin endpoint : /admin/medicines
      // public endpoint reuse  /medicines
      const q = qs({ search, status, page: 1, limit: 20 });
      const res = await api<Paginated<Medicine>>(`/medicines${q}`);
      setItems(res.data || []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

const updateStatus = async (id: string, next: MedicineStatus) => {
  try {
    await api(`/medicines/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
    });

    load();
  } catch (e) {
    console.error(e);
    alert("Status update failed");
  }
};


  return (
    <RoleGuard allow={["ADMIN"]}>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-xl font-semibold">All Medicines</h1>

          <div className="flex gap-2">
            <input
              className="px-3 py-2 border rounded-lg"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="px-3 py-2 border rounded-lg" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50" onClick={load}>
              Apply
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6">Loading...</div>
        ) : (
          <div className="overflow-x-auto bg-white border rounded-xl">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Brand</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((m) => (
                  <tr key={m.id} className="border-b">
                    <td className="p-3">
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.manufacturer}</div>
                    </td>
                    <td className="p-3">{m.brand}</td>
                    <td className="p-3">৳ {m.price}</td>
                    <td className="p-3">{m.stock}</td>
                    <td className="p-3">
                      <Badge text={m.status} />
                    </td>
                    <td className="p-3 text-right">
                      <select
                        className="px-2 py-1 border rounded-lg"
                        value={m.status}
                        onChange={(e) => updateStatus(m.id, e.target.value as MedicineStatus)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
