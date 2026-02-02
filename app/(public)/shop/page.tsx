"use client";

import { useEffect, useMemo, useState } from "react";
import MedicineCard from "@/components/common/MedicineCard";
import { api, qs } from "@/lib/api";
import type { Category, Medicine, Paginated, MedicineForm } from "@/lib/types";

const FORMS: MedicineForm[] = ["TABLET", "CAPSULE", "SYRUP", "INJECTION", "OINTMENT", "DROPS"];

export default function ShopPage() {
  const [items, setItems] = useState<Medicine[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  // filters
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [form, setForm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "price" | "name">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const query = useMemo(() => {
    return qs({
      search,
      categoryId,
      form,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page: 1,
      limit: 12,
    });
  }, [search, categoryId, form, minPrice, maxPrice, sortBy, sortOrder]);

  // load categories (public)
  useEffect(() => {
    (async () => {
      try {
        const c = await api<{ data: Category[] }>("/categories");
        setCats(c.data ?? []);
      } catch (e: any) {
        console.error("categories error:", e?.message || e);
      }
    })();
  }, []);

  // load medicines (public)
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await api<Paginated<Medicine>>(`/medicines${query}`);
        setItems(res.data ?? []);
      } catch (e: any) {
        console.error("medicines error:", e?.message || e);
        setItems([]);
        setErr(e?.message || "Failed to load medicines");
      } finally {
        setLoading(false);
      }
    })();
  }, [query]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Shop</h1>
        <p className="text-sm text-gray-600">Browse OTC medicines</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 p-4 bg-white border rounded-xl md:grid-cols-6">
        <input
          className="px-3 py-2 border rounded-lg md:col-span-2"
          placeholder="Search medicine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-3 py-2 border rounded-lg"
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
          className="px-3 py-2 border rounded-lg"
          value={form}
          onChange={(e) => setForm(e.target.value)}
        >
          <option value="">All forms</option>
          {FORMS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <input
          className="px-3 py-2 border rounded-lg"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          className="px-3 py-2 border rounded-lg"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <div className="flex gap-2 md:col-span-2">
          <select
            className="w-full px-3 py-2 border rounded-lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="createdAt">Newest</option>
            <option value="name">Name (A-Z)</option>
            <option value="price">Price</option>
          </select>
          <select
            className="w-full px-3 py-2 border rounded-lg"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="p-6">Loading...</div>
      ) : err ? (
        <div className="p-6 text-red-600 bg-white border rounded-xl">
          {err}
        </div>
      ) : items.length === 0 ? (
        <div className="p-6 bg-white border rounded-xl">No medicines found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((m) => (
            <MedicineCard key={m.id} m={m} />
          ))}
        </div>
      )}
    </div>
  );
}
