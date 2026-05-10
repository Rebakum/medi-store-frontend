"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RoleGuard from "@/components/common/role-guard";
import { apiJson, apiForm, apiDelete } from "@/lib/api";
import type { Category } from "@/lib/types";
import CategoryTable from "@/components/common/CategoryTable";

type ApiList<T> = { success: boolean; message: string; data: T[] };

export default function AdminCategoriesPage() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string>("");
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await apiJson<ApiList<Category>>("/categories");
      setData(res.data || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

 const onDelete = async (id: string) => {
  const ok = window.confirm("Delete this category?");
  if (!ok) return;

  setBusyId(id);
  try {
    await apiDelete(`/categories/${id}`);
    await load();
  } catch (e: any) {
    setError(e?.message || "Delete failed");
  } finally {
    setBusyId("");
  }
};


  return (
    <RoleGuard allow={["ADMIN"]}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Categories</h2>

          <Link
            href="/dashboard/admin/categories/new"
           className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
          >
            + New Category
          </Link>
        </div>

        {error ? <div className="p-2 text-sm text-red-600 border rounded">{error}</div> : null}

        {loading ? (
          <div className="p-4">Loading...</div>
        ) : (
          <CategoryTable data={data} onDelete={onDelete} busyId={busyId} />
        )}
      </div>
    </RoleGuard>
  );
}
