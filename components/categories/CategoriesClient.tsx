"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/axios";

type Category = {
  id: string;
  name: string;
  image?: string;
};

export default function CategoriesClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const selectedId = sp.get("categoryId");

  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // ✅ Pagination state
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  const ASSET = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "";

  // ✅ Load categories with pagination
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await api.get(`/categories?page=${page}&limit=8`);

        setItems(res.data?.data ?? []);
        setMeta(res.data?.meta);
      } catch (e: any) {
        setErr(e?.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  const imgSrc = (p?: string) => {
    if (!p) return "/logo.png";
    return p.startsWith("http") ? p : `${ASSET}${p}`;
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">📂 Categories</h1>
        <p className="text-sm text-gray-500">
          Browse medicines by category
        </p>
      </div>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Error */}
      {err && <p className="text-red-600">{err}</p>}

      {/* Content */}
      {!loading && !err && (
        <>
          {/* ❌ Empty State */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <img
                src="/empty-box.png"
                alt="No data"
                className="w-32 h-32 mb-4 opacity-80"
              />

              <h2 className="text-xl font-semibold text-gray-700">
                No Categories Available 😔
              </h2>

              <p className="max-w-sm mt-2 text-sm text-gray-500">
                বর্তমানে কোনো ক্যাটাগরি পাওয়া যায়নি। পরে আবার চেষ্টা করুন।
              </p>

              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                🔄 Refresh
              </button>
            </div>
          ) : (
            <>
              {/* ✅ Category Grid */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-6 lg:grid-cols-8">
                {items.map((c) => (
                  <button
                    key={c.id}
                    onClick={() =>
                      router.push(`/shop?categoryId=${c.id}`)
                    }
                    className={`group text-left border rounded-xl overflow-hidden hover:shadow-lg transition ${
                      selectedId === c.id ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <img
                      src={imgSrc(c.image)}
                      alt={c.name}
                      className="object-cover w-full h-32 transition group-hover:scale-105"
                    />
                    <div className="p-3 font-medium">{c.name}</div>
                  </button>
                ))}
              </div>

              {/* ✅ Pagination */}
              {meta && meta.totalPage > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">

                  {/* Prev */}
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 border rounded "
                  >
                    Prev
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: meta.totalPage }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-1 rounded ${
                        page === i + 1
                          ? "bg-blue-500 text-white"
                          : "border"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    disabled={page === meta.totalPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 border rounded "
                  >
                    Next
                  </button>

                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}