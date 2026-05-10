"use client";

import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

type UploadRes = { success: boolean; data?: { logo?: string | null } };

export default function BrandLogoUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string>("");

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
      //  backend: POST /api/v1/admin/logo
      const res = await api<UploadRes>("/admin/logo", {
        method: "POST",
        body: fd,
      });

      const logo = res?.data?.logo || "";
      setSavedUrl(logo);

      toast.success("Logo uploaded!");
      //  navbar instantly update (if you added listener in Navbar)
      window.dispatchEvent(new Event("brand_logo_updated"));

      // optional clear
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
        <h2 className="text-lg font-semibold">Brand Logo Upload</h2>
        <p className="text-sm text-slate-500">
          Upload a new logo (PNG/JPG/WebP). It will replace the previous logo.
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        {file && (
          <div className="p-4 bg-white border rounded-2xl dark:bg-slate-950 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Preview</p>
                <p className="mt-1 text-xs text-slate-500">
                  {file.name} • {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFile(null)}
                className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
              >
                Remove
              </button>
            </div>

            <div className="flex items-center gap-4 mt-3">
              <div className="w-24 h-24 overflow-hidden bg-white border rounded-2xl dark:bg-slate-950 dark:border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Selected logo preview"
                  className="object-contain w-full h-full p-2"
                />
              </div>

              <button
                type="button"
                onClick={onUpload}
                disabled={uploading}
                className="rounded-xl bg-[#2EB0D9] px-4 py-2 text-white hover:bg-[#38CAE4] disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        )}

        {!file && (
          <button
            type="button"
            onClick={onUpload}
            disabled
           className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
          >
            Upload
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
          Tip: 512×512 PNG/WebP best. Background transparent .
        </p>
      </div>
    </div>
  );
}
