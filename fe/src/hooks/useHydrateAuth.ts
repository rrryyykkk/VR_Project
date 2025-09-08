// hooks/useHydrateAuth.ts
import { useEffect } from "react";
import { useAuthStore } from "../app/store/AuthStore";
import { getMeAdmin } from "../app/api/admin";
import { getMeUser } from "../app/api/users";

export function useHydrateAuth() {
  const { setAdmin, setUser, clearAuth, role } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (role === "admin") {
          const res = await getMeAdmin();
          setAdmin(res.data);
        } else if (role === "user") {
          const res = await getMeUser();
          setUser(res.data);
        }
      } catch {
        clearAuth(); // token invalid/expired
      }
    };

    fetchProfile();
  }, [role, setAdmin, setUser, clearAuth]);
}
