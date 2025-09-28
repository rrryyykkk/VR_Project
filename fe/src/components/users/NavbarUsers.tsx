// NavbarUsers.tsx
import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";

interface NavbarUsersProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const NavbarUsers = ({ setIsSidebarOpen }: NavbarUsersProps) => {
  return (
    <nav className="bg-white shadow px-4 py-3 flex items-center justify-between border-b border-pink-100">
      {/* Burger menu */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-pink-100 transition"
      >
        <FaBars className="w-6 h-6 text-pink-600" />
      </button>

      {/* Title */}
      <h1 className="font-semibold text-lg md:text-xl text-pink-700 truncate">
        👋 Selamat Datang, User
      </h1>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-pink-100 transition">
          <FaBell className="w-5 h-5 text-pink-600" />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>
        <FaUserCircle className="w-8 h-8 text-pink-600 cursor-pointer hover:scale-105 transition" />
      </div>
    </nav>
  );
};

export default NavbarUsers;
