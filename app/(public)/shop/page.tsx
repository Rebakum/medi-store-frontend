"use client";

import { useEffect, useMemo, useState } from "react";
import MedicineCard from "@/components/common/MedicineCard";
import { api, qs } from "@/lib/api";
import type { Category, Medicine, Paginated, MedicineForm } from "@/lib/types";
import { useDebounce } from "@/components/hooks/useDebounce";

const FORMS: MedicineForm[] = [
  "TABLET",
  "CAPSULE",
  "SYRUP",
  "INJECTION",
  "OINTMENT",
  "DROPS",
];

export default function ShopPage() {
  const [items, setItems] = useState<Medicine[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [meta, setMeta] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [form, setForm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [sortBy, setSortBy] = useState<"createdAt" | "price" | "name">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const query = useMemo(() => {
    return qs({
      search: debouncedSearch,
      categoryId,
      form,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page,
      limit: 12,
    });
  }, [debouncedSearch, categoryId, form, minPrice, maxPrice, sortBy, sortOrder, page]);

  useEffect(() => {
    (async () => {
      try {
        const c = await api<{ data: Category[] }>("/categories");
        setCats(c.data ?? []);
      } catch (e: any) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");

      try {
        const res = await api<Paginated<Medicine>>(`/medicines${query}`);
        setItems(res.data ?? []);
        setMeta(res.meta);
      } catch (e: any) {
        setErr(e?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryId, form, minPrice, maxPrice]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            🛍️ Medicine Shop
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Find your medicines easily with smart filters & AI search
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 text-sm bg-gray-100 rounded-lg">
            Total: <span className="font-semibold">{meta?.total || 0}</span>
          </div>

          <select
            className="px-3 py-2 border rounded-lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="createdAt">Newest</option>
            <option value="name">A-Z</option>
            <option value="price">Price</option>
          </select>

          <select
            className="px-3 py-2 border rounded-lg"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="p-4 space-y-3 bg-white border rounded-xl">
          <input
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="w-full px-3 py-2 border rounded-lg"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All categories</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="w-full px-3 py-2 border rounded-lg"
            value={form}
            onChange={(e) => setForm(e.target.value)}
          >
            <option value="">All forms</option>
            {FORMS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4 lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-[260px] rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : err ? (
            <p className="text-red-500">{err}</p>
          ) : items.length === 0 ? (
            <p>No medicines found</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((m) => (
                  <MedicineCard key={m.id} m={m} />
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: meta?.totalPage || 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      page === i + 1
                        ? "bg-[#2EB0D9] text-white"
                        : "border"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === meta?.totalPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
