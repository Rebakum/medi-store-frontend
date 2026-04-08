"use client";

import { Suspense } from "react";
import LoginInner from "@/components/auth/LoginInner";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading...</div>}>
      <LoginInner />
    </Suspense>
  );
}
