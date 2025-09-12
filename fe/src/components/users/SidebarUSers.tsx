import { FaUser, FaHistory, FaSignOutAlt, FaHome } from "react-icons/fa";

interface SidebarUsersProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SidebarUsers = ({ isOpen, setIsOpen }: SidebarUsersProps) => {
  const menuItems = [
    { name: "Home", icon: FaHome, href: "/" },
    { name: "Profil", icon: FaUser, href: "/profile" },
    { name: "Riwayat", icon: FaHistory, href: "/users/history" },
  ];

  return (
    <aside
      className={`bg-white shadow-lg border-r border-pink-100 w-64 p-6 h-screen overflow-y-auto z-50
        fixed top-0 left-0 transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:block`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl font-bold text-pink-600 tracking-wide">
            User Menu
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-500 hover:text-pink-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition font-medium"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </a>
          ))}
        </nav>

        {/* Logout - stays at bottom */}
        <button className="mt-auto flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition font-medium cursor-pointer">
          <FaSignOutAlt className="w-5 h-5" />
          Keluar
        </button>
      </div>
    </aside>
  );
};

export default SidebarUsers;
