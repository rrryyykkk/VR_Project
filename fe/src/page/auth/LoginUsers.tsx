import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useToast } from "../../hooks/ToastContext";
import { useAuthStore } from "../../app/store/AuthStore";
import { FiEye, FiEyeOff } from "react-icons/fi"; // 👈 import icon

const LoginUsers = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { addToast } = useToast();
  const { loginUser, loading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginUser({ email, password });

    if (success) {
      addToast("Login berhasil!", "success");
      navigate("/", { replace: true }); // redirect ke users
    } else {
      // ambil error dari store
      const errorMessage = useAuthStore.getState().error || "Login gagal!";
      addToast(errorMessage, "error");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center relative overflow-hidden">
      {/* Haikei wave */}
      <svg
        className="absolute top-0 w-full h-48 text-pink-100 rotate-180"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,64L48,80C96,96,192,128,288,138.7C384,149,480,139,576,149.3C672,160,768,192,864,197.3C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-xl rounded-3xl p-8 md:p-12 w-11/12 max-w-md z-10"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-fuchsia-600 text-center mb-6">
          Selamat Datang Kembali 👋
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Silakan logiUsersn untuk melanjutkan
        </p>

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
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
              placeholder="you@example.com"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
              placeholder="********"
            />
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
            className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-semibold py-2 rounded-xl hover:brightness-110 transition cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-fuchsia-600 hover:underline font-medium cursor-pointer"
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </motion.div>

      {/* Haikei wave bottom */}
      <svg
        className="absolute bottom-0 w-full h-48 text-pink-100"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,224L48,202.7C96,181,192,139,288,133.3C384,128,480,160,576,165.3C672,171,768,149,864,133.3C960,117,1056,107,1152,112C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default LoginUsers;
