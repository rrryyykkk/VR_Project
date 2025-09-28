// UsersLayout.tsx
import { useState } from "react";
import NavbarUsers from "../components/users/NavbarUsers";
import SidebarUsers from "../components/users/SidebarUSers";

interface UsersLayoutProps {
  children: React.ReactNode;
}

export default function UsersLayout({ children }: UsersLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-pink-50 relative">
      {/* Sidebar */}
      <SidebarUsers isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Overlay for mobile/tablet */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Area kanan */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <div className="sticky top-0 z-30">
          <NavbarUsers setIsSidebarOpen={setIsSidebarOpen} />
        </div>

        {/* Konten */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
      {/* footer */}
    </div>
  );
}
