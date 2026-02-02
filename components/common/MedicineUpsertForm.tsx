"use client";

import { useEffect, useMemo, useState } from "react";
import {  } from "@/lib/types";
import type { Category, Medicine, MedicineForm, MedicineStatus, ApiOne } from "@/lib/types";
import { apiForm, apiJson } from "@/lib/api";

const FORMS: MedicineForm[] = ["TABLET", "CAPSULE", "SYRUP", "INJECTION", "OINTMENT", "DROPS"];
const STATUSES: MedicineStatus[] = ["ACTIVE", "OUT_OF_STOCK", "DISABLED"];

type Props = {
  mode: "create" | "edit";
  medicineId?: string;
  onDone: () => void;
};

export default function MedicineUpsertForm({ mode, medicineId, onDone }: Props) {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // fields
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [form, setForm] = useState<MedicineForm>("TABLET");
  const [price, setPrice] = useState<string>("0");
  const [stock, setStock] = useState<string>("0");
  const [manufacturer, setManufacturer] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<MedicineStatus>("ACTIVE");
  const [images, setImages] = useState<File[]>([]);

  const title = useMemo(() => (mode === "create" ? "Add Medicine" : "Edit Medicine"), [mode]);

  useEffect(() => {
    (async () => {
      try {
        // categories endpoint ধরলাম /categories (তোমার backend যদি /categories থাকে)
        const res = await apiJson<{ data: Category[] }>("/categories");
        setCats(res.data || []);
        if (!categoryId && res.data?.[0]?.id) setCategoryId(res.data[0].id);
      } catch (e) {
        // categories না থাকলেও form চলবে
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !medicineId) return;

    (async () => {
      setLoading(true);
      try {
        const res = await apiJson<ApiOne<Medicine>>(`/medicines/${medicineId}`);
        const m = res.data;

        setName(m.name || "");
        setBrand(m.brand || "");
        setForm(m.form);
        setPrice(String(m.price ?? 0));
        setStock(String(m.stock ?? 0));
        setManufacturer(m.manufacturer || "");
        setDescription(m.description || "");
        setCategoryId(m.categoryId || "");
        setStatus(m.status);
      } catch (e: any) {
        setError(e.message || "Failed to load medicine");
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, medicineId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const fd = new FormData();

      fd.append("name", name);
      fd.append("brand", brand);
      fd.append("form", form);
      fd.append("price", price);
      fd.append("stock", stock);
      fd.append("manufacturer", manufacturer);
      fd.append("description", description);
      fd.append("categoryId", categoryId);
      fd.append("status", status);

      // multer field name: images
      images.forEach((f) => fd.append("images", f));

      if (mode === "create") {
        await apiForm("/medicines", fd, "POST");
      } else {
        if (!medicineId) throw new Error("medicineId missing");
        await apiForm(`/medicines/${medicineId}`, fd, "PATCH");
      }

      onDone();
    } catch (e: any) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading form...</div>;

  return (
    <form onSubmit={onSubmit} className="p-4 space-y-3 bg-white border rounded-xl">
      <div className="text-lg font-semibold">{title}</div>

      {error && <div className="p-2 text-sm text-red-600 border rounded">{error}</div>}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input className="px-3 py-2 border rounded" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="px-3 py-2 border rounded" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />

        <select className="px-3 py-2 border rounded" value={form} onChange={(e) => setForm(e.target.value as MedicineForm)}>
          {FORMS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <select className="px-3 py-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value as MedicineStatus)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <input className="px-3 py-2 border rounded" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input className="px-3 py-2 border rounded" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />

        <input
          className="px-3 py-2 border rounded md:col-span-2"
          placeholder="Manufacturer"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
        />

        <select className="px-3 py-2 border rounded md:col-span-2" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {cats.length === 0 ? (
            <option value="">No categories</option>
          ) : (
            cats.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))
          )}
        </select>

        <textarea
          className="border rounded px-3 py-2 md:col-span-2 min-h-[120px]"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Images (max 6)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files || []))}
        />
        {images.length > 0 && <div className="text-xs text-gray-500">{images.length} file selected</div>}
      </div>

      <button
        disabled={saving}
        className="w-full py-2 border rounded hover:bg-gray-50 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
