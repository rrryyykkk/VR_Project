import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../app/store/AuthStore";
import { motion } from "framer-motion";

type ProtectedRouteProps = {
  role?: "admin" | "user";
};

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { user, admin, loading } = useAuthStore();

  // Loading overlay
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
        <motion.div
          className="w-16 h-16 border-4 border-fuchsia-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        ></motion.div>
        <div className="mt-4 text-fuchsia-600 font-semibold text-lg">
          Memuat halaman...
        </div>
      </div>
    );
  }

  if (role === "admin" && !admin) return <Navigate to="/login-admin" replace />;
  if (role === "user" && !user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
