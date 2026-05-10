export default function HomeMedicinesSkeleton() {
  return (
    <section className="py-10">
      <div className="px-4 mx-auto space-y-6 max-w-7xl">
        <div className="flex flex-col items-center gap-4 mb-10 text-center">
          <div className="h-6 w-32 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-10 w-64 rounded-lg bg-gray-200 animate-pulse" />
          <div className="h-4 w-96 max-w-full rounded bg-gray-200 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[260px] rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
