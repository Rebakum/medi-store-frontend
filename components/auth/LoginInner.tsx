"use client";

import { useState, useEffect } from "react";
import useAuth from "@/components/hooks/useAuth";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginInner() {
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const search = useSearchParams();
  const redirect = search.get("redirect");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast.success("Login successful!");
    } catch (e: any) {
      toast.error(e?.message || "Login failed");
    }
  };

  useEffect(() => {
    if (!user) return;

    if (user.role === "ADMIN") router.replace("/dashboard/admin");
    else if (user.role === "SELLER") router.replace("/dashboard/seller");
    else router.replace(redirect || "/dashboard/customer");
  }, [user, router, redirect]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md p-6 space-y-4 border rounded-xl">
        <h1 className="text-2xl font-semibold">Login</h1>

        <input
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white
                     bg-[#2EB0D9] hover:bg-[#38CAE4] transition shadow-sm disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <small>
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </small>
      </form>
    </div>
  );
}
