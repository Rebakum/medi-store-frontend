"use client";

import { useMemo, useState } from "react";
import { apiJson } from "@/lib/api";
import toast from "react-hot-toast";
import type { ApiResponse, MeUser } from "@/lib/types";

type UploadRes = ApiResponse<{
  sellerLogo?: string | null;
  title?: string | null;
}>;

export default function BrandLogoUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string>("");
  const [title, setTitle] = useState("");


  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  const onUpload = async () => {
    if (!file) return toast.error("Select a logo first");


   const fd = new FormData();
      fd.append("logo", file);
      


    setUploading(true);
    try {
      //  correct endpoint + method
      const res = await apiJson<UploadRes>("/auth/me/seller-logo", {
        method: "PATCH",
        body: fd,
      });

      const logo = res?.data?.sellerLogo ?? "";
      setSavedUrl(logo);

      toast.success("Seller logo uploaded!");

      //  home featured brands refresh
      window.dispatchEvent(new Event("featured_brands_updated"));

      setFile(null);
    } catch (e: any) {
      toast.error(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl p-6 space-y-5 border rounded-2xl bg-white/70 dark:bg-white/5 dark:border-white/10">
      <div>
        <h2 className="text-lg font-semibold">Seller Brand Logo</h2>
        <p className="text-sm text-slate-500">
          Upload your brand logo. It will appear in Featured Brands section.
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <label className="text-sm font-medium">Brand Title</label>
    


      {file && (
        <div className="p-4 border rounded-2xl dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Preview</p>
              <p className="text-xs text-slate-500">
                {file.name} • {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFile(null)}
              className="rounded-xl bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
            >
              Remove
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="preview"
              className="object-contain w-24 h-24 p-2 bg-white border rounded-xl dark:bg-slate-900 dark:border-white/10"
            />

            <button
              onClick={onUpload}
              disabled={uploading}
              className="rounded-xl bg-[#2EB0D9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#38CAE4] disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload Logo"}
            </button>
          </div>
        </div>
      )}

      {!file && (
        <button
          disabled
          className="rounded-xl bg-[#2EB0D9] px-4 py-2 text-sm font-semibold text-white opacity-60"
        >
          Upload Logo
        </button>
      )}

      {savedUrl && (
        <div className="p-3 text-sm border rounded-xl bg-sky-50 border-sky-100 dark:bg-white/5 dark:border-white/10">
          <p className="font-medium">Saved Path:</p>
          <p className="break-all text-slate-600 dark:text-slate-300">
            {savedUrl}
          </p>
        </div>
      )}

      <p className="text-xs text-slate-500">
        Tip: Transparent PNG/WebP logo works best (512×512 recommended).
      </p>
    </div>
  );
}
