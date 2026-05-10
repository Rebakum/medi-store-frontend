export default function ContactSkeleton() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="h-8 w-48 mx-auto rounded-lg bg-gray-200 animate-pulse" />
          <div className="h-12 w-96 mx-auto mt-6 rounded-lg bg-gray-200 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[500px] rounded-3xl bg-gray-100 animate-pulse" />
          <div className="h-[500px] rounded-3xl bg-gray-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
