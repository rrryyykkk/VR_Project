import { Navigate, Outlet } from "react-router";
import { useEffect } from "react";
import { useAuthStore } from "../app/store/AuthStore";
import { useUserProfile } from "../app/store/UserStore";
import { useAdminProfile } from "../app/store/AdminStore";

type ProtectedRouteProps = {
  role?: "admin" | "user";
};

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { user, admin, role: currentRole, setUser, setAdmin } = useAuthStore();
  const { data: userData, isLoading: userLoading } = useUserProfile();
  const { data: adminData, isLoading: adminLoading } = useAdminProfile();

  // kalau profile sudah ada hasilnya, simpan ke store
  useEffect(() => {
    if (userData && !user) setUser(userData);
  }, [userData, user, setUser]);

  useEffect(() => {
    if (adminData && !admin) setAdmin(adminData);
  }, [adminData, admin, setAdmin]);

  // tunggu sampai fetch selesai
  if (userLoading || adminLoading) return <div>Loading...</div>;

  // belum login sesuai role
  if ((role === "admin" && !admin) || (role === "user" && !user)) {
    return (
      <Navigate to={role === "admin" ? "/login-admin" : "/login"} replace />
    );
  }

  // role tidak sesuai
  if (role && currentRole !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
