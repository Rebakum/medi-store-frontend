export default function ImageSliderSkeleton() {
  return (
    <div className="space-y-3">
      <div className="relative h-[340px] rounded-2xl bg-slate-200/70 dark:bg-white/10 animate-pulse" />
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 rounded-lg bg-slate-200/70 dark:bg-white/10 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
