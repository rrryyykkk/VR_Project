// src/components/VR/VRSessionAdmin.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineRefresh } from "react-icons/md";

import type { UserVR } from "../../type/user";
import { useAllUsers } from "../../app/store/UserStore";
import TaskByAdmin from "../../components/admin/TaskByAdmin";
import { useToast } from "../../hooks/ToastContext";

const VRSessionAdmin = () => {
  const [selectedUser, setSelectedUser] = useState<UserVR | null>(null);

  const { addToast } = useToast();

  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useAllUsers() as {
    data: UserVR[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  };
  console.log("users", users);

  const handleDetailClick = (user: UserVR) => {
    if (user.isActive && user.isRecord) {
      setSelectedUser(user);
    } else {
      addToast(
        `User ${user.fullName} tidak sedang aktif VR atau tidak sedang record!`,
        "error"
      );
    }
  };

  const closeModal = () => setSelectedUser(null);

  // Loading UI
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-b-4 "></div>
      </div>
    );

  // Error UI
  if (isError)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg shadow-md">
          Gagal memuat data user.{" "}
          <button onClick={refetch} className="underline font-semibold ml-2">
            Coba lagi
          </button>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header + Refresh */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Monitoring Sesi Pengguna
        </h1>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 shadow-sm transition"
        >
          <MdOutlineRefresh size={20} /> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Usia</th>
              <th className="px-4 py-3 text-center">Gender</th>
              <th className="px-4 py-3 text-center">Login</th>
              <th className="px-4 py-3 text-center">VR</th>
              <th className="px-4 py-3 text-center">Record</th>
              <th className="px-4 py-3 text-center">Device</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user, idx) => (
              <tr
                key={user.id}
                className={`hover:bg-gray-50 ${
                  idx % 2 === 0 ? "bg-gray-50/30" : "bg-white"
                }`}
              >
                <td className="px-4 py-2">{user.fullName}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 text-center">{user.age}</td>
                <td className="px-4 py-2 text-center">{user.gender}</td>
                <td
                  className={`px-4 py-2 text-center font-semibold ${
                    user.isLogin ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {user.isLogin ? "Login" : "Logout"}
                </td>
                <td
                  className={`px-4 py-2 text-center font-semibold ${
                    user.isActive ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {user.isActive ? "Aktif" : "Nonaktif"}
                </td>
                <td
                  className={`px-4 py-2 text-center font-semibold ${
                    user.isRecord ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {user.isRecord ? "Record" : "Idle"}
                </td>
                <td className="px-4 py-2 text-center">{user.device || "-"}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleDetailClick(user)}
                    className="text-blue-600 hover:text-blue-800 font-semibold underline"
                  >
                    Lihat Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  Detail {selectedUser.fullName}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-white text-2xl font-bold hover:text-red-300"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Info */}
                <div className="space-y-3 text-sm">
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
                    <strong>Device:</strong> {selectedUser.device || "-"}
                  </p>
                  <p>
                    <strong>Login:</strong>{" "}
                    <span
                      className={
                        selectedUser.isLogin ? "text-green-600" : "text-red-500"
                      }
                    >
                      {selectedUser.isLogin ? "Ya" : "Tidak"}
                    </span>
                  </p>
                  <p>
                    <strong>VR Aktif:</strong>{" "}
                    <span
                      className={
                        selectedUser.isActive
                          ? "text-blue-600"
                          : "text-gray-500"
                      }
                    >
                      {selectedUser.isActive ? "Ya" : "Tidak"}
                    </span>
                  </p>
                  <p>
                    <strong>Sedang Record:</strong>{" "}
                    <span
                      className={
                        selectedUser.isRecord
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {selectedUser.isRecord ? "Ya" : "Tidak"}
                    </span>
                  </p>
                </div>

                {/* Task Manager */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <TaskByAdmin user={selectedUser} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VRSessionAdmin;
