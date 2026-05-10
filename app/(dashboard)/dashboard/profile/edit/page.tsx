"use client";

import { useEffect, useMemo, useState } from "react";
import RoleGuard from "@/components/common/role-guard";
import { api, apiForm } from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Role } from "@/lib/types";



type MeUser = {
  id: string;
  name?: string | null;
  email: string;
  role: Role;
  phone?: string | null;
  avatar?: string | null;
};

type ApiOne<T> = { success: boolean; message: string; data: T };

export default function ProfileEditPage() {
  const router = useRouter();

  const [me, setMe] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [saving, setSaving] = useState(false);

  const assetBase = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "";

  const avatarUrl = useMemo(() => {
    const a = me?.avatar?.trim();
    if (!a) return "";
    return a.startsWith("http") ? a : `${assetBase}${a}`;
  }, [me?.avatar, assetBase]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api<ApiOne<MeUser>>("/auth/me");
      setMe(res.data);
      setEmail(res.data.email || "");
      setName(res.data.name ?? "");
      setPhone(res.data.phone ?? "");
      setPassword("");
    } catch (e: any) {
      toast.error(e.message || "Failed to load profile");
      setMe(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     load();
  api("/auth/me").then((res:any)=>{
    setName(res.data.name || "");
    setPhone(res.data.phone || "");
  });
}, []);


  const uploadAvatar = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append("avatar", file); 
      await apiForm("/auth/me/avatar", fd, "PATCH");
      toast.success("Avatar updated");
      await load();
    } catch (e: any) {
      toast.error(e.message || "Avatar upload failed");
    }
  };

const save = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    const payload: any = {
      name: name.trim(),
      phone: phone.trim(),
    };

    // password optional
    if (password.trim()) {
      payload.password = password.trim();
    }

    console.log("SENDING:", payload); 

    await api("/auth/profile", {
      method: "PUT",
      body: payload,
    });

    toast.success("Profile updated");

    // redirect to view page
    router.replace("/dashboard/profile");

  } catch (e: any) {
    toast.error(e.message || "Update failed");
  } finally {
    setSaving(false);
  }
};


  return (
    <RoleGuard allow={["CUSTOMER", "SELLER", "ADMIN"]}>
      <div className="max-w-md p-4 mx-auto sm:p-6">
        <div className="p-6 bg-white border rounded-2xl border-slate-200 dark:border-white/10 dark:bg-white/5">
          {loading ? (
            <div className="text-sm text-slate-600 dark:text-slate-300">Loading...</div>
          ) : !me ? (
            <div className="text-sm text-slate-600 dark:text-slate-300">Not found</div>
          ) : (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Edit Profile
                </h1>
                <Link
                  href="/dashboard/profile"
                  className="text-sm text-slate-600 dark:text-slate-300 hover:underline"
                >
                  Back
                </Link>
              </div>

              {/* Avatar top */}
              <div className="flex flex-col items-center gap-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="object-cover w-24 h-24 border rounded-full border-slate-200 dark:border-white/10"
                  />
                ) : (
                  <div className="flex items-center justify-center w-24 h-24 text-2xl font-semibold rounded-full bg-slate-200 dark:bg-white/10">
                    {(me.name || me.email)[0].toUpperCase()}
                  </div>
                )}

                <label
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadAvatar(f);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>
              </div>

              {/* Form (email, name, phone, password) */}
              <form onSubmit={save} className="space-y-3">
                {/* Email readonly */}
                <div>
                  <label className="block mb-1 text-xs text-slate-600 dark:text-slate-300">
                    Email
                  </label>
                  <input
                    value={email}
                    readOnly
                    className="w-full px-3 py-2 border rounded-lg cursor-not-allowed border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs text-slate-600 dark:text-slate-300">
                    Name
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-white border rounded-lg border-slate-200 dark:border-white/10 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs text-slate-600 dark:text-slate-300">
                    Phone
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-white border rounded-lg border-slate-200 dark:border-white/10 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs text-slate-600 dark:text-slate-300">
                    Password (optional)
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-white border rounded-lg border-slate-200 dark:border-white/10 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    type="password"
                  />
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Leave empty to keep current password.
                  </p>
                </div>

                <button
                  disabled={saving}
                  className="w-full py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
