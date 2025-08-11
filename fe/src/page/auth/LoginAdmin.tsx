import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router";

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: autentikasi admin
    console.log("Admin login:", { email, password });
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
          <div className="flex justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c0-1.105-.895-2-2-2s-2 .895-2 2 .895 2 2 2 2-.895 2-2zm-2 2v6m4-10v10m-6-6h6"
              />
            </svg>
          </div>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-2 rounded-xl hover:brightness-110 transition cursor-pointer"
          >
            Login
          </button>
        </form>

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
