import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthLoading: false,
      authError: null,

      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),

      setIsAuthLoading: (value) => set({ isAuthLoading: value }),
      setAuthError: (message) => set({ authError: message }),
    }),
    {
      name: "auth-store",
    },
  ),
);

export default useAuthStore;
