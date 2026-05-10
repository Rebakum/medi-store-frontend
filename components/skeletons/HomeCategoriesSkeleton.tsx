export default function HomeCategoriesSkeleton() {
  return (
    <section className="px-4 py-12 mx-auto max-w-7xl">
      <div className="flex flex-col items-center gap-4 mb-10 text-center">
        <div className="h-6 w-40 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-10 w-80 rounded-lg bg-gray-200 animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}
