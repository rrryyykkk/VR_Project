import type { User } from "../../type/user";
import { create } from "zustand";
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

type loginCredentials = { email: string; password: string };

type AuthState = {
  user: User | null;
  admin: Admin | null;
  role: "admin" | "user" | null;
  loading: boolean;
  error: string | null;

  // Actions
  setAdmin: (admin: Admin) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;

  loginAdmin: (credentials: loginCredentials) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  loginUser: (credentials: loginCredentials) => Promise<boolean>;
  logoutUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  admin: null,
  role: null,
  loading: false,
  error: null,

  setAdmin: (admin: Admin) => set({ admin, role: "admin" }),
  setUser: (user: User) => set({ user, role: "user" }),
  clearAuth: () => set({ user: null, admin: null, role: null, error: null }),

  loginAdmin: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await adminLogin(credentials);
      if (!res.data) throw new Error("Email atau password salah");
      set({ admin: res.data, role: "admin", loading: false });
      return true; // sukses
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Admin login gagal",
        loading: false,
      });
      return false; // gagal
    }
  },

  logoutAdmin: async () => {
    try {
      await adminLogout();
      set({ admin: null, role: null });
    } catch {
      set({ error: "Admin logout gagal" });
    }
  },

  loginUser: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await userLogin(credentials);
      if (!res.data) throw new Error("Email atau password salah");
      set({ user: res.data, role: "user", loading: false });
      return true;
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "User login gagal",
        loading: false,
      });
      return false;
    }
  },

  logoutUser: async () => {
    try {
      await userLogout();
      set({ user: null, role: null });
    } catch {
      set({ error: "User logout gagal" });
    }
  },
}));
