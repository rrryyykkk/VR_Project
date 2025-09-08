import { motion } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiBarChart2,
  FiUser,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router";
import { TbBadgeVr } from "react-icons/tb";
import { useAuthStore } from "../../app/store/AuthStore";
import { useToast } from "../../hooks/ToastContext";

const SidebarAdmin = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const navigate = useNavigate();
  const { logoutAdmin } = useAuthStore();
  const { addToast } = useToast();

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      addToast("Logout berhasil!", "success");
      navigate("/login-admin");
    } catch {
      addToast("Logout gagal!", "error");
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/admin" },
    { name: "Users", icon: <FiUsers />, path: "/admin/users" },
    { name: "Analytics", icon: <FiBarChart2 />, path: "/admin/analytics" },
    { name: "VR/XR", icon: <TbBadgeVr />, path: "/admin/VrAdmin" },
    { name: "Profile", icon: <FiUser />, path: "/admin/profile" },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`bg-gray-900 text-gray-100 h-screen p-4 flex flex-col justify-between shadow-lg ${
        isOpen ? "w-64" : "w-20"
      } transition-all duration-300`}
    >
      <div>
        {/* Hamburger here */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 rounded hover:bg-white/10 transition-colors mb-6 mx-auto cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <FiMenu className="text-xl" />
        </button>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition-colors ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className={`flex items-center cursor-pointer ${
          isOpen ? "gap-3 justify-start" : "justify-center"
        } p-3 rounded hover:bg-red-600 hover:text-white transition-colors mt-4`}
      >
        <FiLogOut className="text-xl" />
        {isOpen && <span className="text-sm font-medium">Logout</span>}
      </button>
    </motion.aside>
  );
};

export default SidebarAdmin;
