"use client";

import useAuth from "@/hooks/useAuth";
import ThemeToggle from "./theme-toggle";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between p-4 border-b">
      <p>{user?.email}</p>

      <div className="flex gap-3">
        <ThemeToggle />
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
}