"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

type Category = {
  id: string;
  name: string;
  slug?: string;
};

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await api.get("/categories");
        const data = res.data?.data ?? []; // {success,message,data:[]}
        setItems(data);
      } catch (e: any) {
        setErr(e?.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Categories</h1>

      {loading && <p>Loading...</p>}
      {err && <p className="text-red-600">{err}</p>}

      {!loading && !err && (
        <>
          {items.length === 0 ? (
            <p className="text-gray-500">No categories found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {items.map((c) => (
                <div key={c.id} className="border rounded-lg p-3 hover:shadow-sm">
                  <p className="font-medium">{c.name}</p>
                  {c.slug && <p className="text-xs text-gray-500">{c.slug}</p>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
