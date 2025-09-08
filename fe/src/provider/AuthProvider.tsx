import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../app/store/AuthStore";
import { api } from "../app/api/Axios";

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const { user, role, logoutAdmin, logoutUser } = useAuthStore();

  useEffect(() => {
    // cek session user/admin saat refresh
    const checkSession = async () => {
      try {
        if (!user && !role) {
          const res = await api.get("/auth/user/getMe"); // contoh endpoint user
          if (res.data) {
            useAuthStore.setState({ user: res.data, role: "user" });
          }
        }
      } catch {
        logoutUser();
      }

      try {
        if (!user && !role) {
          const res = await api.get("/auth/admin/getMe"); // contoh endpoint admin
          if (res.data) {
            useAuthStore.setState({ user: res.data, role: "admin" });
          }
        }
      } catch {
        logoutAdmin();
      }
    };

    checkSession();
  }, [user, role, logoutAdmin, logoutUser]);

  return <>{children}</>;
}
