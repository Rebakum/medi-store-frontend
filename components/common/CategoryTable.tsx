"use client";

import Link from "next/link";
import type { Category } from "@/lib/types";

type Props = {
  data: Category[];
  onDelete: (id: string) => void;
  busyId?: string;
};

export default function CategoryTable({ data, onDelete, busyId }: Props) {
  const assetBase = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "";

  const imgSrc = (p?: string | null) => {
    if (!p) return "";
    return p.startsWith("http") ? p : `${assetBase}${p}`;
  };

  return (
    <div className="overflow-x-auto bg-white border rounded-xl">
      <table className="w-full text-sm">
        <thead className="text-left border-b bg-gray-50">
          <tr>
            <th className="p-3">Category</th>
            <th className="p-3">Image</th>
            <th className="p-3 w-[220px]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((c) => (
            <tr key={c.id} className="align-middle border-b">
              <td className="p-3 font-medium">{c.name}</td>

              <td className="p-3">
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imgSrc(c.image)}
                    alt={c.name}
                    className="object-cover w-16 h-12 border rounded"
                  />
                ) : (
                  <span className="text-xs text-gray-400">No image</span>
                )}
              </td>

            <td className="p-3">
            <div className="flex gap-2">
                <Link
                className="px-3 py-1 border rounded hover:bg-gray-50"
                href={`/categories?categoryId=${c.id}`}
                >
                View
                </Link>

                <Link
                className="px-3 py-1 border rounded hover:bg-gray-50"
                href={`/dashboard/admin/categories/${c.id}`}
                >
                Edit
                </Link>

                <button
                onClick={() => onDelete(c.id)}
                disabled={busyId === c.id}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-60"
                >
                {busyId === c.id ? "Deleting..." : "Delete"}
                </button>
            </div>
            </td>

            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan={3} className="p-6 text-center text-gray-400">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
