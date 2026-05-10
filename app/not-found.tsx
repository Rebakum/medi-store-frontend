import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="space-y-4 text-center">
        <h1 className="text-5xl font-bold">404</h1>

        <p className="text-slate-600">
          Sorry —This page is Not found 🙂
        </p>

        <Link
          href="/"
          className="inline-flex px-5 py-2 text-white rounded-xl bg-slate-900 hover:opacity-90"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
