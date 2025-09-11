import { create } from "zustand";
import type { User } from "../../type/user";
import { adminLogin, adminLogout, userLogin, userLogout } from "../api/auth";

export type Admin = {
  id: string;
  email: string;
  userName: string;
  password: string;
  fullName: string;
  imgProfile: string;
  createdAt: Date;
};

type LoginCredentials = { email: string; password: string };

type AuthState = {
  user: User | null;
  admin: Admin | null;
  role: "admin" | "user" | null;
  loading: boolean;
  error: string | null;

  setAdmin: (admin: Admin) => void;
  setUser: (user: User) => void;
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
  role: null,
  loading: false,
  error: null,

  setAdmin: (admin: Admin) => set({ admin, role: "admin" }),
  setUser: (user: User) => set({ user, role: "user" }),
  clearAuth: () =>
    set({ user: null, admin: null, role: null, error: null, loading: false }),

  loginAdmin: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await adminLogin(credentials);
      if (!res.data) throw new Error("Email atau password salah");
      set({ admin: res.data, role: "admin", loading: false });
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
      set({ admin: null, role: null });
    }
  },

  loginUser: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await userLogin(credentials);
      if (!res.data) throw new Error("Email atau password salah");
      set({ user: res.data, role: "user", loading: false });
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
      set({ user: null, role: null });
    }
  },
}));
