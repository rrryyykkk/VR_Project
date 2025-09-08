import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../app/store/AuthStore";
import { useToast } from "../../hooks/ToastContext";
import { FiEye, FiEyeOff } from "react-icons/fi"; // 👈 import icon

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 state buat toggle
  const navigate = useNavigate();

  const { addToast } = useToast();
  const { loginAdmin, loading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // memanggil loginAdmin yang mengembalikan boolean
    const success = await loginAdmin({ email, password });

    if (success) {
      addToast("Login berhasil!", "success");
      navigate("/admin", { replace: true }); // redirect ke admin
    } else {
      // ambil error dari store
      const errorMessage = useAuthStore.getState().error || "Login gagal!";
      addToast(errorMessage, "error");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center relative overflow-hidden">
      {/* Wave top */}
      <svg
        className="absolute top-0 w-full h-48 text-blue-100 rotate-180"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,64L48,80C96,96,192,128,288,138.7C384,149,480,139,576,149.3C672,160,768,192,864,197.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,0L0,0Z"
        ></path>
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-2xl rounded-3xl p-8 md:p-12 w-11/12 max-w-md z-10 border border-blue-100"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700">
            Admin Area
          </h2>
          <p className="text-gray-500 mt-2">Masuk untuk mengelola sistem</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="admin@example.com"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"} // 👈 toggle type
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 pr-10"
              placeholder="********"
            />
            {/* 👁️ icon toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-blue-600 cursor-pointer"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-2 rounded-xl hover:brightness-110 transition cursor-pointer disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
        )}

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </motion.div>

      {/* Wave bottom */}
      <svg
        className="absolute bottom-0 w-full h-48 text-blue-100"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,224L48,202.7C96,181,192,139,288,133.3C384,128,480,160,576,165.3C672,171,768,149,864,133.3C960,117,1056,107,1152,112C1248,117,1344,139,1392,149.3L1440,160L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default LoginAdmin;
