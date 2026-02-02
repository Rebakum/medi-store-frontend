"use client";

import Link from "next/link";
import useAuth from "@/hooks/useAuth";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 p-4 space-y-4 border-r">
      <h2 className="text-lg font-semibold">Dashboard</h2>

      <nav className="flex flex-col gap-2 text-sm">

        {user?.role === "ADMIN" && (
          <>
            <Link className="hover:underline" href="/dashboard/admin">Home</Link>
            <Link className="hover:underline" href="/dashboard/admin/users">Users</Link>
            <Link className="hover:underline" href="/dashboard/admin/orders">Orders</Link>
            <Link className="hover:underline" href="/dashboard/admin/products">Products</Link>
          </>
        )}

        {user?.role === "SELLER" && (
          <>
            <Link className="hover:underline" href="/dashboard/seller">Home</Link>
            <Link className="hover:underline" href="/dashboard/seller/medicines">Medicines</Link>
          </>
        )}

        {user?.role === "CUSTOMER" && (
          <>
            <Link className="hover:underline" href="/dashboard/customer">Home</Link>
            <Link className="hover:underline" href="/cart">Cart</Link>
          </>
        )}

      </nav>
    </aside>
  );
}
