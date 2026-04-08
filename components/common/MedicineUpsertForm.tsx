"use client";

import { useEffect, useMemo, useState } from "react";
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

  // images
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // ✅ brand logo
  const [brandLogo, setBrandLogo] = useState<File | null>(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState<string>("");
  const [existingBrandLogo, setExistingBrandLogo] = useState<string>("");

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

  const titleText = useMemo(
    () => (mode === "create" ? "Add Medicine" : "Edit Medicine"),
    [mode]
  );

  const assetBase = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "";

  // load categories
  useEffect(() => {
    (async () => {
      try {
        const res = await apiJson<{ data: Category[] }>("/categories");
        const list = res.data || [];
        setCats(list);
        if (!categoryId && list?.[0]?.id) setCategoryId(list[0].id);
      } catch (e) {
        console.error(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load medicine for edit
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

        setExistingImages(m.images || []);
        setExistingBrandLogo(m.brandLogo || ""); // ✅ NEW
      } catch (e: any) {
        setError(e?.message || "Failed to load medicine");
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, medicineId]);

  // preview for new selected images
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [images]);

  // preview for brand logo
  useEffect(() => {
    if (!brandLogo) {
      setBrandLogoPreview("");
      return;
    }
    const url = URL.createObjectURL(brandLogo);
    setBrandLogoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [brandLogo]);

  const maxTotal = 6;
  const maxNew = mode === "edit" ? Math.max(0, maxTotal - (existingImages?.length || 0)) : maxTotal;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (!name.trim()) throw new Error("Name is required");
      if (!brand.trim()) throw new Error("Brand is required");
      if (!manufacturer.trim()) throw new Error("Manufacturer is required");
      if (!description.trim()) throw new Error("Description is required");
      if (!categoryId) throw new Error("Category is required");

      // create mode: at least 1 image required
      if (mode === "create" && images.length === 0) {
        throw new Error("At least 1 image is required");
      }

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

      // images
      images.forEach((f) => fd.append("images", f));

      // ✅ brandLogo (optional)
      if (brandLogo) fd.append("brandLogo", brandLogo);

      if (mode === "create") {
        await apiForm("/medicines", fd, "POST");
      } else {
        if (!medicineId) throw new Error("medicineId missing");
        await apiForm(`/medicines/${medicineId}`, fd, "PATCH");
      }

      onDone();
    } catch (e: any) {
      setError(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading form...</div>;

  return (
    <form onSubmit={onSubmit} className="p-4 space-y-4 bg-white border rounded-xl">
      <div className="text-lg font-semibold">{titleText}</div>

      {error ? (
        <div className="p-2 text-sm text-red-600 border rounded">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          className="px-3 py-2 border rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="px-3 py-2 border rounded"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        {/* ✅ Brand Logo (optional) */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Brand Logo (optional)</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBrandLogo(e.target.files?.[0] ?? null)}
          />

          {/* existing brandLogo */}
          {mode === "edit" && existingBrandLogo ? (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${assetBase}${existingBrandLogo}`}
                alt="existing brand logo"
                className="object-contain bg-white border h-14 w-14 rounded-xl"
              />
              <p className="text-xs text-slate-500">Current brand logo</p>
            </div>
          ) : null}

          {/* new selected preview */}
          {brandLogoPreview ? (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brandLogoPreview}
                alt="brand logo preview"
                className="object-contain bg-white border h-14 w-14 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setBrandLogo(null)}
                className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ) : null}
        </div>

        <select
          className="px-3 py-2 border rounded"
          value={form}
          onChange={(e) => setForm(e.target.value as MedicineForm)}
        >
          {FORMS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          className="px-3 py-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value as MedicineStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={0}
          className="px-3 py-2 border rounded"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          min={0}
          className="px-3 py-2 border rounded"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <input
          className="px-3 py-2 border rounded md:col-span-2"
          placeholder="Manufacturer"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
        />

        <select
          className="px-3 py-2 border rounded md:col-span-2"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {cats.length === 0 ? (
            <option value="">No categories</option>
          ) : (
            cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
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

      {/* Existing images (edit only) */}
      {mode === "edit" && existingImages.length > 0 ? (
        <div className="space-y-2">
          <div className="text-sm font-medium">Existing Images</div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {existingImages.map((src) => (
              <div key={src} className="overflow-hidden border rounded">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${assetBase}${src}`}
                  alt="existing"
                  className="object-cover w-full h-28"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            These images will stay. New images will be added. (Remaining slots: {maxNew})
          </p>
        </div>
      ) : null}

      {/* New images select + preview */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Add Images (max {maxNew})</label>

        <input
          className="text-blue-600 cursor-pointer"
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []).slice(0, maxNew);
            setImages(files);
          }}
        />

        {images.length > 0 ? (
          <>
            <div className="text-xs text-red-500">{images.length} new file selected</div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {previews.map((src, idx) => (
                <div key={src} className="relative overflow-hidden border rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`preview-${idx}`} className="object-cover w-full h-28" />

                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute px-2 py-1 text-xs text-white rounded top-2 right-2 bg-black/70"
                  >
                    X
                  </button>

                  <div className="p-2 text-[11px] text-gray-600 truncate">{images[idx]?.name}</div>
                </div>
              ))}
            </div>
          </>
        ) : null}
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
