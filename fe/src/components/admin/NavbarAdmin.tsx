import { motion } from "framer-motion";

const NavbarAdmin = () => {
  return (
    <motion.nav
      className="w-full h-16 flex items-center justify-between px-4 md:px-8 shadow relative z-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-white font-bold text-lg md:text-xl drop-shadow-sm">
        Admin Dashboard XR
      </h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="hidden md:block"
      >
        <span className="text-gray-200 text-sm">Welcome, Admin 👋</span>
      </motion.div>
    </motion.nav>
  );
};

export default NavbarAdmin;
