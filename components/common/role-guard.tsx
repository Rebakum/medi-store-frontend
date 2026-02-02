"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

type Role = "CUSTOMER" | "SELLER" | "ADMIN";

const homeByRole: Record<Role, string> = {
  ADMIN: "/dashboard/admin",
  SELLER: "/dashboard/seller",
  CUSTOMER: "/dashboard/customer",
};

export default function RoleGuard({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

   
    if (!user) {
      router.replace("/login");
      return;
    }

   
    if (!allow.includes(user.role)) {
      const target = homeByRole[user.role];
      if (pathname !== target) router.replace(target);
    }
  }, [loading, user, allow, router, pathname]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">Redirecting...</div>;
  if (!allow.includes(user.role)) return <div className="p-6">Redirecting...</div>;

  return <>{children}</>;
}
