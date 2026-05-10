"use client";

import { useEffect } from "react";
import useAuth from "@/components/hooks/useAuth";
import { useSocket } from "@/components/hooks/useSocket";

export default function SocketBridge() {
  const { user, loading } = useAuth();
  const { socket, connected } = useSocket();

  useEffect(() => {
    if (loading || !user?.id || !connected) return;

    socket.emit("join", {
      userId: user.id,
      role: user.role,
    });

    console.log(" Joined:", user.id);
  }, [loading, user, connected, socket]);

  return null;
}