import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>404 - Halaman Tidak Ditemukan</title>
        <meta
          name="description"
          content="Halaman yang kamu cari tidak ditemukan. Kembali ke halaman utama untuk melanjutkan."
        />
      </Helmet>

      {/* Haikei Wave Top */}
      <svg
        className="absolute top-0 w-full h-48 text-purple-200 rotate-180"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,106.7C672,117,768,139,864,144C960,149,1056,139,1152,138.7C1248,139,1344,149,1392,154.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>

      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-purple-50 via-pink-50 to-pink-100"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-4 sm:px-8 md:px-16 lg:px-32">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold text-fuchsia-700 mb-6"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-700 mb-8"
        >
          Maaf, halaman yang kamu cari tidak ditemukan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            to="/"
            className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full font-semibold shadow-lg transition"
          >
            Kembali ke Beranda
          </Link>
        </motion.div>
      </div>

      {/* Haikei Wave Bottom */}
      <svg
        className="absolute bottom-0 w-full h-48 text-purple-200"
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

export default NotFound;
