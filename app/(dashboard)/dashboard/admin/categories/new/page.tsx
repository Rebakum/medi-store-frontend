"use client";

import { useRouter } from "next/navigation";
import RoleGuard from "@/components/common/role-guard";
import CategoryUpsertForm from "@/components/common/CategoryUpsertForm";

export default function AdminCategoryCreatePage() {
  const router = useRouter();

  return (
    <RoleGuard allow={["ADMIN"]}>
      <div className="max-w-2xl p-4">
        <CategoryUpsertForm
          mode="create"
          onDone={() => router.push("/dashboard/admin/categories")}
        />
      </div>
    </RoleGuard>
  );
}
