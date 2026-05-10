"use client";

import { useParams, useRouter } from "next/navigation";
import RoleGuard from "@/components/common/role-guard";
import CategoryUpsertForm from "@/components/common/CategoryUpsertForm";

export default function AdminCategoryEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  if (!id) return <div className="p-4">Invalid category</div>;

  return (
    <RoleGuard allow={["ADMIN"]}>
      <div className="max-w-2xl p-4">
        <CategoryUpsertForm
          mode="edit"
          categoryId={id}
          onDone={() => router.push("/dashboard/admin/categories")}
        />
      </div>
    </RoleGuard>
  );
}
