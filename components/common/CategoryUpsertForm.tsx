"use client";

import { useEffect, useMemo, useState } from "react";
import { apiForm, apiJson } from "@/lib/api";
import type { Category } from "@/lib/types";

type ApiOne<T> = { success: boolean; message: string; data: T };

type Props = {
  mode: "create" | "edit";
  categoryId?: string;
  onDone: () => void;
};

export default function CategoryUpsertForm({ mode, categoryId, onDone }: Props) {
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // previews
  const [preview, setPreview] = useState<string>("");
  const [existingImage, setExistingImage] = useState<string>("");

  const title = useMemo(() => (mode === "create" ? "Add Category" : "Edit Category"), [mode]);
  const assetBase = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "";

  // edit load
  useEffect(() => {
    if (mode !== "edit" || !categoryId) return;

    (async () => {
      setLoading(true);
      try {
        const res = await apiJson<ApiOne<Category>>(`/categories/${categoryId}`);
        const c = res.data;
        setName(c.name || "");
        setExistingImage(c.image || "");
      } catch (e: any) {
        setError(e?.message || "Failed to load category");
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, categoryId]);

  // preview for new selected file
  useEffect(() => {
    if (!imageFile) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (!name.trim()) throw new Error("Name is required");

      // multer single field name: "image"
      const fd = new FormData();
      fd.append("name", name.trim());
      if (imageFile) fd.append("image", imageFile);

      if (mode === "create") {
        // create: ideally require image (optional যদি backend allow করে)
        // if (!imageFile) throw new Error("Image is required");
        await apiForm("/categories", fd, "POST");
      } else {
        if (!categoryId) throw new Error("categoryId missing");
        await apiForm(`/categories/${categoryId}`, fd, "PATCH");
      }

      onDone();
    } catch (e: any) {
      setError(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading form...</div>;

  const existingSrc = existingImage
    ? existingImage.startsWith("http")
      ? existingImage
      : `${assetBase}${existingImage}`
    : "";

  return (
    <form onSubmit={onSubmit} className="p-4 space-y-4 bg-white border rounded-xl">
      <div className="text-lg font-semibold">{title}</div>

      {error ? <div className="p-2 text-sm text-red-600 border rounded">{error}</div> : null}

      <div className="space-y-2">
        <label className="text-sm font-medium">Category Name</label>
        <input
          className="w-full px-3 py-2 border rounded"
          placeholder="e.g. Women Health Care"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Existing image (edit only) */}
      {mode === "edit" && existingSrc ? (
        <div className="space-y-2">
          <div className="text-sm font-medium">Existing Image</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={existingSrc} alt="existing" className="object-cover w-full h-40 max-w-sm border rounded" />
          <p className="text-xs text-gray-500">If you upload a new image, it will replace the old one.</p>
        </div>
      ) : null}

      {/* New image */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />

        {preview ? (
          <div className="space-y-2">
            <div className="text-xs text-gray-500">Preview</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="preview" className="object-cover w-full h-40 max-w-sm border rounded" />
          </div>
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
