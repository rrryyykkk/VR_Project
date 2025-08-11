import { useState } from "react";
import NavbarAdmin from "../components/admin/NavbarAdmin";
import SidebarAdmin from "../components/admin/SidebarAdmin";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {" "}
      {/* full height seperti users */}
      {/* Sidebar */}
      <SidebarAdmin isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      {/* Konten kanan: Navbar + Main */}
      <div className="flex flex-col flex-1">
        <NavbarAdmin />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>{" "}
        {/* tambah flex-1 dan overflow-y-auto supaya main bisa scroll jika isi panjang */}
      </div>
    </div>
  );
};

export default AdminLayout;
