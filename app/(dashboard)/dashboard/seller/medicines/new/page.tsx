"use client";

import { useRouter } from "next/navigation";
import RoleGuard from "@/components/common/role-guard";
import MedicineUpsertForm from "@/components/common/MedicineUpsertForm";

export default function NewMedicinePage() {
  const router = useRouter();

  return (
    <RoleGuard allow={["SELLER", "ADMIN"]}>
      <MedicineUpsertForm
        mode="create"
        onDone={() => router.push("/dashboard/seller/medicines")}
      />
    </RoleGuard>
  );
}
