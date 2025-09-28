import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../app/store/AuthStore";

type ProtectedRouteProps = {
  role?: "admin" | "user";
};

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { user, admin, loading } = useAuthStore();

  console.log("ProtectedRoute check:", { role, user, admin, loading });

  // Redirect **hanya jika user sudah fetch tapi null**
  if (role === "user" && !user) return <Navigate to="/login" replace />;
  if (role === "admin" && !admin) return <Navigate to="/login-admin" replace />;

  return <Outlet />;
}
