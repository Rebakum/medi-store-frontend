import { apiJson as api } from "@/lib/api";

export const authService = {
  login: async (payload: any) => {
    const res = await api<any>("/auth/login", { method: "POST", body: payload });
    return res.data; // { user, accessToken }
  },

  register: async (payload: any) => {
    const res = await api<any>("/auth/register", { method: "POST", body: payload });
    return res.data;
  },

  me: async () => {
    const res = await api<any>("/auth/me");
    return res; // { success, message, data: user }
  },
};
