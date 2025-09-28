import { create } from "zustand";
import type { User } from "../../type/user";
import { adminLogin, adminLogout, userLogin, userLogout } from "../api/auth";
import { useEffect } from "react";
import { getMeUser } from "../api/users";

export type Admin = {
  id: string;
  email: string;
  fullName: string;
  imgProfile: string;
  createdAt: Date;
};

type LoginCredentials = { email: string; password: string };

type AuthState = {
  user: User | null;
  admin: Admin | null;
  loading: boolean;
  error: string | null;

  setAdmin: (admin: Admin) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;

  loginAdmin: (credentials: LoginCredentials) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  loginUser: (credentials: LoginCredentials) => Promise<boolean>;
  logoutUser: () => Promise<void>;
};

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  admin: null,
  loading: false,
  error: null,

  setAdmin: (admin: Admin) => set({ admin }),
  setUser: (user) => set({ user, loading: false }),
  clearAuth: () =>
    set({ user: null, admin: null, error: null, loading: false }),

  loginAdmin: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await adminLogin(credentials);
      if (!res.data) throw new Error("Email atau password salah");
      set({ admin: res.data, loading: false });
      return true;
    } catch (err: unknown) {
      set({ error: getErrorMessage(err, "Admin login gagal"), loading: false });
      return false;
    }
  },

  logoutAdmin: async () => {
    try {
      await adminLogout();
    } catch {
      set({ error: "Admin logout gagal" });
    } finally {
      set({ admin: null });
    }
  },

  loginUser: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await userLogin(credentials);
      if (!res.data) throw new Error("Email atau password salah");
      set({ user: res.data, loading: false });
      return true;
    } catch (err: unknown) {
      set({ error: getErrorMessage(err, "User login gagal"), loading: false });
      return false;
    }
  },

  logoutUser: async () => {
    try {
      await userLogout();
    } catch {
      set({ error: "User logout gagal" });
    } finally {
      set({ user: null });
    }
  },
}));

// initialze Auth
export const useInitializeAuthUser = () => {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    getMeUser()
      .then((res) => setUser(res))
      .catch(() => setUser(null));
  }, [setUser]);
};
