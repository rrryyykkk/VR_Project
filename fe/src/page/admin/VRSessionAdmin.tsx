// VRSessionAdmin.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserVR } from "../../type/user";
import { useAllUsers } from "../../app/store/UserStore";

const VRSessionAdmin = () => {
  const [selectedUser, setSelectedUser] = useState<UserVR | null>(null);

  const {
    data: users = [],
    isLoading,
    isError,
  } = useAllUsers() as {
    data: UserVR[];
    isLoading: boolean;
    isError: boolean;
  };


  const openUserDetail = (user: UserVR) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Gagal memuat data user</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6">Monitoring Sesi Pengguna</h1>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Nama</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Email
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Usia
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Gender
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Status Login
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Status VR
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Perangkat
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => openUserDetail(user)}
            >
              <td className="border border-gray-300 px-4 py-2">
                {user.fullName}
              </td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {user.age}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {user.gender}
              </td>
              <td
                className={`border border-gray-300 px-4 py-2 text-center font-semibold ${
                  user.isLogin ? "text-green-700" : "text-red-500"
                }`}
              >
                {user.isLogin ? "Sedang Login" : "Tidak Login"}
              </td>
              <td
                className={`border border-gray-300 px-4 py-2 text-center font-semibold ${
                  user.isActive ? "text-blue-700" : "text-gray-400"
                }`}
              >
                {user.isActive ? "Aktif VR" : "Tidak Aktif"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {user.device || "-"}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center text-blue-600 underline">
                Lihat Detail
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-red-600 font-bold text-xl cursor-pointer"
                aria-label="Tutup modal"
              >
                &times;
              </button>

              <h2 className="text-2xl font-bold mb-4">
                Detail {selectedUser.fullName}
              </h2>

              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Umur:</strong> {selectedUser.age}
              </p>
              <p>
                <strong>Gender:</strong> {selectedUser.gender}
              </p>
              <p>
                <strong>Status Login:</strong>{" "}
                {selectedUser.isLogin ? "Sedang Login" : "Tidak Login"}
              </p>
              <p>
                <strong>Status VR:</strong>{" "}
                {selectedUser.isActive ? "Aktif VR" : "Tidak Aktif"}
              </p>
              <p>
                <strong>Perangkat:</strong> {selectedUser.device || "-"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VRSessionAdmin;
