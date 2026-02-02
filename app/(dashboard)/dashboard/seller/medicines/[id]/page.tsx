"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, apiForm } from "@/lib/api";

export default function EditMedicine() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [m, setM] = useState<any>(null);
  const [files, setFiles] = useState<FileList | null>(null);

  useEffect(() => {
    api(`/medicines/${id}`).then((r: any) => setM(r.data));
  }, [id]);

  if (!m) return null;

  const submit = async (e: any) => {
    e.preventDefault();
    const f = new FormData(e.target);
    if (files) [...files].forEach((x) => f.append("images", x));

    await apiForm(`/medicines/${id}`, f, "PATCH");
    router.push("/dashboard/seller/medicines");
  };

  return (
    <form onSubmit={submit} className="p-6 space-y-3">
      <input name="name" defaultValue={m.name} />
      <input name="price" defaultValue={m.price} />
      <input name="stock" defaultValue={m.stock} />
      <textarea name="description" defaultValue={m.description} />
      <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />

      <button className="px-4 py-2 border">Update</button>
    </form>
  );
}
