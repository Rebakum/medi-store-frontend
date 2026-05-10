import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

/** Socket.io attaches to the HTTP server origin, not the REST `/api/v1` path. */
function resolveSocketOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();
  if (explicit) {
    try {
      const u = new URL(explicit);
      return `${u.protocol}//${u.host}`;
    } catch {
      return explicit.replace(/\/$/, "");
    }
  }

  const api = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (api) {
    try {
      const u = new URL(api);
      return `${u.protocol}//${u.host}`;
    } catch {
      /* ignore */
    }
  }

  return "http://localhost:5000";
}

export const getSocket = (): Socket => {
  if (!socket) {
    const url = resolveSocketOrigin();

    socket = io(url, {
      // Default Socket.io behavior: polling first, then upgrade to websocket.
      // Forcing only "websocket" often causes "websocket error" in dev / behind proxies.
      transports: ["polling", "websocket"],
      upgrade: true,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      auth: {
        token:
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null,
      },
    });

    socket.on("connect", () => {
      if (process.env.NODE_ENV === "development") {
        console.log("Socket connected:", socket?.id);
      }
    });

    socket.on("disconnect", (reason) => {
      if (process.env.NODE_ENV === "development") {
        console.log("Socket disconnected:", reason);
      }
    });

    socket.on("connect_error", (err) => {
      console.warn(
        `[socket] ${err.message} (origin: ${url}). Start the API with Socket.io, set NEXT_PUBLIC_SOCKET_URL if it differs from the API host, and check CORS.`
      );
    });
  }

  return socket;
};
