"use client";

import { useEffect, useState } from "react";
import RoleGuard from "@/components/common/role-guard";
import { apiJson as api } from "@/lib/api";
import toast from "react-hot-toast";

type ReviewRow = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: { id: string; name?: string | null; email?: string | null; avatar?: string | null };
  medicine?: { id: string; name: string; brand?: string | null };
};

export default function AdminReviewsPage() {
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [medicineId, setMedicineId] = useState("");
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set("page", String(page));
      qs.set("limit", "10");
      if (search.trim()) qs.set("search", search.trim());
      if (medicineId.trim()) qs.set("medicineId", medicineId.trim());

      const res = await api<any>(`/reviews?${qs.toString()}`);
      setRows(res.data ?? []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load reviews");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const remove = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await api(`/reviews/${id}`, { method: "DELETE" });
      toast.success("Review deleted");
      load();
    } catch (e: any) {
      toast.error(e.message || "Delete failed");
    }
  };

  return (
    <RoleGuard allow={["ADMIN"]}>
      <div className="p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold">All Reviews</h1>

          <div className="flex gap-2">
            <input
              className="px-3 py-2 border rounded-lg w-[220px]"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              className="px-3 py-2 border rounded-lg w-[260px]"
              placeholder="MedicineId (optional)"
              value={medicineId}
              onChange={(e) => setMedicineId(e.target.value)}
            />
            <button
              onClick={() => {
                setPage(1);
                load();
              }}
             className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="overflow-hidden border rounded-xl">
          {loading ? (
            <div className="p-6">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="p-6">No reviews found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3 text-left">Medicine</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Rating</th>
                  <th className="p-3 text-left">Comment</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">
                      <div className="font-medium">{r.medicine?.name ?? "-"}</div>
                      <div className="text-xs text-slate-500">{r.medicine?.brand ?? ""}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{r.user?.name ?? "User"}</div>
                      <div className="text-xs text-slate-500">{r.user?.email ?? ""}</div>
                    </td>
                    <td className="p-3">⭐ {r.rating}</td>
                    <td className="p-3">{r.comment ?? "-"}</td>
                    <td className="p-3">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <button
                        onClick={() => remove(r.id)}
                        className="px-3 py-2 text-red-700 rounded-lg bg-red-50 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-between">
          <button
            className="px-3 py-2 border rounded-lg disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>
          <button className="px-3 py-2 border rounded-lg" onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      </div>
    </RoleGuard>
  );
}
