"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RoleGuard from "@/components/common/role-guard";
import toast from "react-hot-toast";
import { apiJson as api } from "@/lib/api";
import { Role, User } from "@/lib/types";





export default function AdminUserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api<{ data: User }>(`/auth/users/${id}`);
      setUser(res.data);
    } catch (e: any) {
      toast.error(e.message || "Failed to load user");
      router.replace("/dashboard/admin/users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // frontend-only rule
  const canDelete = user?.role !== "ADMIN";

  const removeUser = async () => {
    if (!user) return;
    if (!canDelete) {
      toast.error("Super Admin cannot be deleted.");
      return;
    }

    if (!confirm(`Delete user: ${user.email}?`)) return;

    try {
      await api(`/auth/users/${user.id}`, { method: "DELETE" });
      toast.success("User deleted");
      router.replace("/dashboard/admin/users");
    } catch (e: any) {
      toast.error(e.message || "Delete failed");
    }
  };

  return (
    <RoleGuard allow={["ADMIN"]}>
      <div className="max-w-3xl p-4 mx-auto sm:p-6">
        {loading ? (
          <div className="text-sm text-slate-600 dark:text-slate-300">Loading...</div>
        ) : !user ? (
          <div className="text-sm text-slate-600 dark:text-slate-300">Not found</div>
        ) : (
          <div className="p-6 space-y-4 bg-white border rounded-2xl border-slate-200 dark:border-white/10 dark:bg-white/5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                User Details
              </h1>

              <span
                className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-500/15 dark:text-blue-200"
              >
                {user.role}
              </span>
            </div>

            {/* Avatar + basic */}
            <div className="flex items-center gap-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="object-cover border rounded-full w-14 h-14"
                />
              ) : (
                <div className="flex items-center justify-center text-lg font-semibold rounded-full w-14 h-14 bg-slate-200 dark:bg-white/10">
                  {(user.name || user.email)[0].toUpperCase()}
                </div>
              )}

              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {user.name || "—"}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  {user.email}
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="p-3 border rounded-lg border-slate-200 dark:border-white/10">
                <div className="text-xs text-slate-500">Status</div>
                <div className={user.isActive ? "text-emerald-600" : "text-red-600"}>
                  {user.isActive ? "Active" : "Inactive"}
                </div>
              </div>

              <div className="p-3 border rounded-lg border-slate-200 dark:border-white/10">
                <div className="text-xs text-slate-500">Joined</div>
                <div className="text-slate-800 dark:text-slate-100">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
              >
                Back
              </button>

              {canDelete && (
                <button
                  onClick={removeUser}
                  className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                       bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm"
                >
                  Delete User
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
