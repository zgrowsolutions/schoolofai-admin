import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: { name: string; email: string } | null;
  token: string | null;
  setToken: (token: string | null) => void;
  setUser: (user: { email: string; name: string } | null) => void;
  getToken: () => string | null;
  logout: () => void;
}

export const useUser = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      getToken: () => get().token,
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "user-storage",
    }
  )
);
