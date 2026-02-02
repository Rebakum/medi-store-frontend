"use client";

import { useState } from "react";
import { apiForm } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateMedicine() {
  const router = useRouter();
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      if (files) [...files].forEach((x) => formData.append("images", x));

      await apiForm("/medicines", formData, "POST");
      router.push("/dashboard/seller/medicines");
    } catch (err) {
      console.error(err);
      alert("Failed to create medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg p-6 mx-auto bg-white shadow-md rounded-xl">
      <h1 className="mb-4 text-2xl font-semibold">Create New Medicine</h1>

      <form onSubmit={submit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            name="name"
            placeholder="Medicine Name"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block mb-1 font-medium">Brand</label>
          <input
            name="brand"
            placeholder="Brand Name"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price (৳)</label>
          <input
            name="price"
            type="number"
            placeholder="Price"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block mb-1 font-medium">Stock</label>
          <input
            name="stock"
            type="number"
            placeholder="Stock Quantity"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Manufacturer */}
        <div>
          <label className="block mb-1 font-medium">Manufacturer</label>
          <input
            name="manufacturer"
            placeholder="Manufacturer"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">Category ID</label>
          <input
            name="categoryId"
            placeholder="Category ID"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            placeholder="Description"
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block mb-1 font-medium">Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="w-full"
          />
          {files && (
            <p className="mt-1 text-sm text-gray-500">
              {files.length} file(s) selected
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Medicine"}
        </button>
      </form>
    </div>
  );
}
