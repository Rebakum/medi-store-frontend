import { Suspense } from "react";
import MedicineDetailsClient from "@/components/medicine/MedicineDetailsClient";
import ImageSliderSkeleton from "@/components/skeletons/ImageSliderSkeleton";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function MedicineDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<MedicineDetailsSkeleton />}>
      <MedicineDetailsClient id={id} />
    </Suspense>
  );
}

function MedicineDetailsSkeleton() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="h-10 rounded-lg w-60 bg-slate-200/70 dark:bg-white/10 animate-pulse" />
        <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
          <ImageSliderSkeleton />
          <div className="space-y-3">
            <div className="w-2/3 h-6 rounded bg-slate-200/70 dark:bg-white/10 animate-pulse" />
            <div className="w-1/2 h-4 rounded bg-slate-200/70 dark:bg-white/10 animate-pulse" />
            <div className="w-40 h-10 rounded bg-slate-200/70 dark:bg-white/10 animate-pulse" />
            <div className="h-28 rounded-2xl bg-slate-200/70 dark:bg-white/10 animate-pulse" />
            <div className="h-12 rounded-2xl bg-slate-200/70 dark:bg-white/10 animate-pulse" />
            <div className="h-12 rounded-2xl bg-slate-200/70 dark:bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
