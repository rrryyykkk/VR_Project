import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineRefresh } from "react-icons/md";

import type { UserVR } from "../../type/user";
import type { VRTaskSession } from "../../type/VRdata";
import { useAllUsers } from "../../app/store/UserStore";
import TaskByAdmin from "../../components/admin/TaskByAdmin";
import { useToast } from "../../hooks/ToastContext";

// ✅ helper format lebih natural
const formatTime = (sec?: number) => {
  if (sec === undefined) return "No Limit";

  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (h > 0) return `${h} Jam ${m} Menit ${s} Detik`;
  if (m > 0) return s > 0 ? `${m} Menit ${s} Detik` : `${m} Menit`;
  return `${s} Detik`;
};

const VRSessionAdmin = () => {
  const [selectedUser, setSelectedUser] = useState<UserVR | null>(null);
  const [tasksByUser, setTasksByUser] = useState<
    Record<string, VRTaskSession[]>
  >({});

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

  const handleAssign = (tasks: VRTaskSession[]) => {
    if (!selectedUser) return;
    setTasksByUser((prev) => ({
      ...prev,
      [selectedUser.id]: tasks,
    }));
    closeModal();
    addToast(`Tasks berhasil diberikan ke ${selectedUser.fullName}`, "success");
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-b-4 "></div>
      </div>
    );
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

      {/* table user list */}
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

      {/* modal task assign */}
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

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <TaskByAdmin user={selectedUser} onAssign={handleAssign} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* assigned tasks list */}
      {Object.keys(tasksByUser).length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Tasks Assigned</h3>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Task</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Timer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {Object.entries(tasksByUser).map(([userId, tasks]) =>
                  tasks.map((task) => (
                    <tr key={task.taskId + userId}>
                      <td className="px-4 py-2">
                        {users.find((u) => u.id === userId)?.fullName || "-"}
                      </td>
                      <td className="px-4 py-2">{task.taskName}</td>
                      <td
                        className={`px-4 py-2 font-semibold ${
                          task.status === "inProgress"
                            ? "text-blue-600"
                            : task.status === "completed"
                            ? "text-green-600"
                            : task.status === "failed"
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {task.status}
                      </td>
                      <td className="px-4 py-2">
                        {formatTime(task.remaining)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VRSessionAdmin;
