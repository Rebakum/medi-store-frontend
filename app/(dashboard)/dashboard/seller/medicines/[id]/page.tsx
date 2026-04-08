"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import RoleGuard from "@/components/common/role-guard";
import MedicineCard from "@/components/common/MedicineCard";
import MedicineUpsertForm from "@/components/common/MedicineUpsertForm";
import { api } from "@/lib/api";
import Link from "next/link";

type ApiResponse<T> = { success: boolean; message: string; data: T };

export default function SellerMedicineDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const sp = useSearchParams();
  const editMode = sp.get("edit") === "1";

  const [m, setM] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await api<ApiResponse<any>>(`/medicines/${id}`);
      setM(res.data);
    })();
  }, [id]);

  if (!m) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <RoleGuard allow={["SELLER", "ADMIN"]}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link className="text-sm underline" href="/dashboard/seller/medicines">
            ← Back
          </Link>

          {!editMode ? (
            <Link className="px-3 py-1 border rounded" href={`/dashboard/seller/medicines/${id}?edit=1`}>
              Edit
            </Link>
          ) : null}
        </div>

        {editMode ? (
          <MedicineUpsertForm
            mode="edit"
            medicineId={id}
            onDone={() => router.push("/dashboard/seller/medicines")}
          />
        ) : (
          //  View mode: MedicineCard style
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MedicineCard m={m} />
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
