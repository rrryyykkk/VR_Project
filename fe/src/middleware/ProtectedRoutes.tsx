import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../app/store/AuthStore";

type ProtectedRouteProps = {
  role?: "admin" | "user";
};

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { user, admin, role: currentRole } = useAuthStore();

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
