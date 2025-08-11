import { useState } from "react";
import NavbarUsers from "../components/users/NavbarUsers";
import SidebarUsers from "../components/users/SidebarUSers";

interface UsersLayoutProps {
  children: React.ReactNode;
}

export default function UsersLayout({ children }: UsersLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-pink-50">
      {/* Sidebar */}
      <SidebarUsers isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Area kanan (Navbar + Konten) */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <NavbarUsers setIsSidebarOpen={setIsSidebarOpen} />

        {/* Konten */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
