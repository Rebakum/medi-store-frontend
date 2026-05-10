"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

export const useSocket = () => {
  const socket = getSocket();

  const [connected, setConnected] = useState(socket.connected);
  const [socketId, setSocketId] = useState<string | null>(socket.id || null);

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      setSocketId(socket.id || null);
    };

    const onDisconnect = () => {
      setConnected(false);
      setSocketId(null);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  return { socket, connected, socketId };
};