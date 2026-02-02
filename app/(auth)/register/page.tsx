"use client";

import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";

export default function RegisterPage() {
  const { register, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "SELLER">("CUSTOMER");
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await register({ name, email, password, role });
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md border rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Register</h1>
        {err && <p className="text-sm text-red-600">{err}</p>}

        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="w-full border rounded-lg px-3 py-2"
          value={role}
          onChange={(e) => setRole(e.target.value as "CUSTOMER" | "SELLER")}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="SELLER">Seller</option>
        </select>

        <button disabled={loading} className="w-full border rounded-lg py-2 disabled:opacity-60">
          {loading ? "Creating..." : "Create account"}
        </button>
         <small>
                        Have a account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
        </small>
      </form>
     
    </div>
  );
}
