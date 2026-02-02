import { api } from "@/lib/axios";

export const authService = {
  login: async (payload: any) => {
    const res = await api.post("/auth/login", payload);

    // ✅ backend wraps inside data
    return res.data.data; // { user, accessToken }
  },

  register: async (payload: any) => {
    const res = await api.post("/auth/register", payload);
    return res.data;
  },

  me: async () => {
    const res = await api.get("/auth/me");
    return res.data; // { success, message, data: user }
  },
};
