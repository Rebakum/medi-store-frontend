"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/auth.service";

type User = {
  id: string;
  email: string;
  name?: string | null;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
};

const TOKEN_KEY = "accessToken";

export default function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      return;
    }

    // backend me response: { success, message, data: user }
    const res = await authService.me();
    const u = (res as any)?.data ?? (res as any)?.user ?? res;
    setUser(u);
  }, []);

  // app load এ token থাকলে me fetch
  useEffect(() => {
    (async () => {
      try {
        await refreshMe();
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshMe]);

const redirectByRole = (role: "CUSTOMER" | "SELLER" | "ADMIN") => {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "SELLER") return "/dashboard/seller";
  return "/dashboard/customer";
};

const login = useCallback(
  async (payload: any) => {
    setLoading(true);
    try {
      const data = await authService.login(payload); // { user, accessToken }

      localStorage.setItem("accessToken", data.accessToken);
      setUser(data.user);

      // role based redirect
      router.push(redirectByRole(data.user.role));
    } finally {
      setLoading(false);
    }
  },
  [router]
);


  const register = useCallback(
    async (payload: any) => {
      setLoading(true);
      try {
        await authService.register(payload);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    router.push("/login");
  }, [router]);

  return { user, loading, login, register, logout };
}
