"use client";

import { useEffect, useMemo, useState } from "react";
import useAuth from "@/components/hooks/useAuth";
import { useSocket } from "@/components/hooks/useSocket";

export default function RealtimeDebugOverlay() {
  const { user, loading } = useAuth();
  const { connected, socket } = useSocket();

  const [mounted, setMounted] = useState(false);
  const [online, setOnline] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  // mount detect
  useEffect(() => {
    setMounted(true);
  }, []);

  // socket listener
  useEffect(() => {
    if (!socket) return;

    const onOnlineUsers = (payload: any) => {
      if (typeof payload === "number") setOnline(payload);
      else setOnline(payload?.count ?? null);
    };

    socket.on("online-users", onOnlineUsers);

    return () => {
      socket.off("online-users", onOnlineUsers);
    };
  }, [socket]);

  const authText = useMemo(() => {
    if (loading) return "Checking...";
    if (!user) return "Guest";
    return `${user.role} (${user.email})`;
  }, [loading, user]);

  if (!mounted) return null;
  if (process.env.NODE_ENV === "production") return null;

  return (
    <>
      {/* ================= FLOAT BUTTON ================= */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-black text-white px-4 py-3 rounded-full shadow-xl z-index-[9999] hover:scale-105 transition"
      >
        🧪 Debug
      </button>

      {/* ================= PANEL ================= */}
      <div
        className={`fixed bottom-20 right-6 w-80 bg-white border rounded-2xl shadow-2xl z-index-[9999] transition-all duration-300 ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <p className="font-semibold">⚡ Realtime Debug</p>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Status</span>
            <span className={connected ? "text-green-500" : "text-red-500"}>
              {connected ? "🟢 Connected" : "🔴 Offline"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>User</span>
            <span className="text-gray-700 text-right max-w-[60%]">
              {authText}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Online Users</span>
            <span className="font-semibold">{online ?? "-"}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 text-[10px] text-gray-400 border-t">
          Dev mode only • realtime socket monitor
        </div>
      </div>
    </>
  );
}