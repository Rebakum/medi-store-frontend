import { Suspense } from "react";
import CategoriesClient from "@/components/categories/CategoriesClient";

export const dynamic = "force-dynamic"; // ✅ build prerender এ আটকে থাকলে এটা রাখো

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <CategoriesClient />
    </Suspense>
  );
}
