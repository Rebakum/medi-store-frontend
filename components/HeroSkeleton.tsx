export default function HeroSkeleton() {
  return (
    <div className="grid items-center grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-2 lg:px-16 animate-pulse">
      
      {/* LEFT */}
      <div className="space-y-6">
        <div className="w-32 h-4 rounded bg-slate-700"></div>

        <div className="w-3/4 h-10 rounded bg-slate-700"></div>
        <div className="w-1/2 h-10 rounded bg-slate-700"></div>

        <div className="w-full h-4 rounded bg-slate-700"></div>
        <div className="w-5/6 h-4 rounded bg-slate-700"></div>

        <div className="w-24 h-6 rounded bg-slate-700"></div>

        <div className="h-12 border bg-slate-800 border-slate-700 rounded-xl"></div>
      </div>

      {/* RIGHT */}
      <div className="flex justify-center">
        <div className="w-64 h-64 rounded-full bg-slate-800"></div>
      </div>
    </div>
  );
}