"use client";

import type { Medicine } from "@/lib/types";
import Link from "next/link";

const statusStyle: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200",
  INACTIVE: "bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-200",
  OUT_OF_STOCK: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200",
};

export default function MyMedicinesTable({
  items,
  onDelete,
  deletingId,
  basePath,
}: {
  items: Medicine[];
  onDelete: (id: string) => void;
  deletingId?: string | null;
  basePath: string;
}) {
  if (!items?.length) return <p className="text-sm text-gray-500">No medicines found.</p>;

  return (
    <div className="overflow-x-auto border rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur border-slate-200 dark:border-white/10">
      <table className="min-w-[900px] w-full text-sm">
        <thead className="bg-slate-50 dark:bg-white/5">
          <tr className="text-left text-xs text-slate-600 dark:text-slate-300 [&>th]:p-3">
            <th>Name</th>
            <th>Brand</th>
            <th>Form</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="[&>tr>td]:p-3">
          {items.map((m) => (
            <tr key={m.id} className="border-t border-slate-200 dark:border-white/10">
              <td className="font-medium">{m.name}</td>
              <td>{m.brand}</td>
              <td>{String(m.form ?? "—")}</td>
              <td> Tk {m.price}</td>
              <td>{m.stock}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusStyle[String(m.status)] ?? "bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-200"
                  }`}
                >
                  {String(m.status)}
                </span>
              </td>

              <td className="text-right">
                <div className="inline-flex flex-wrap justify-end gap-2">
                  <Link className="px-3 py-1 border rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 border-slate-200 dark:border-white/10" href={`${basePath}/${m.id}`}>
                    View
                  </Link>

                  <Link className="px-3 py-1 border rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 border-slate-200 dark:border-white/10" href={`${basePath}/${m.id}?edit=1`}>
                    Edit
                  </Link>

                  <button
                    className="px-3 py-1 text-red-600 border rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 border-slate-200 dark:border-white/10 disabled:opacity-60"
                    disabled={deletingId === m.id}
                    onClick={() => onDelete(m.id)}
                  >
                    {deletingId === m.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
