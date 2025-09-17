// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../app/store/AuthStore";

type ProtectedRouteProps = {
  role?: "admin" | "user";
};

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { user, admin, role: currentRole, loading } = useAuthStore();
  console.log("currentRole", currentRole);
  console.log("user", user);
  console.log("admin", admin);

  const currentUser = currentRole === "admin" ? admin : user;

  if (loading) return <div>Loading...</div>;

  if (role && !currentUser) {
    return (
      <Navigate to={role === "admin" ? "/login-admin" : "/login"} replace />
    );
  }

  if (role && currentRole !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
