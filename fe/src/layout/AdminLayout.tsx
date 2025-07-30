import { useState } from "react";
import NavbarAdmin from "../components/admin/NavbarAdmin";
import SidebarAdmin from "../components/admin/SidebarAdmin";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <SidebarAdmin isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <NavbarAdmin />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
