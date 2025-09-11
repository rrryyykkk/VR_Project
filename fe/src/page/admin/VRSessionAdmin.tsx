// VRSessionAdmin.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { adminSessions } from "../../data/VRsession";
import { type UserVR } from "../../type/user";
import type { VRSession } from "../../type/VRdata";
import { useAllUsers } from "../../app/store/UserStore";

// Extend VRSession dengan isActive
interface VRSessionActive extends VRSession {
  isActive?: boolean;
}

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m} menit ${s} detik`;
};

const VRSessionAdmin = () => {
  const [selectedUser, setSelectedUser] = useState<UserVR | null>(null);
  const [selectedSession, setSelectedSession] =
    useState<VRSessionActive | null>(null);

  const {
    data: users = [],
    isLoading,
    isError,
  } = useAllUsers() as {
    data: UserVR[];
    isLoading: boolean;
    isError: boolean;
  };

  // Ambil sesi VR aktif berdasarkan user
  const getActiveSessionByUser = (userId: string): VRSessionActive | null => {
    const sessions = adminSessions
      .filter((s: VRSessionActive) => s.userId === userId && s.isActive)
      .sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
    return sessions.length > 0 ? sessions[0] : null;
  };

  const getLastRoomName = (session: VRSessionActive | null): string => {
    if (!session?.roomHistory?.length) return "-";
    const sortedRooms = [...session.roomHistory].sort(
      (a, b) =>
        new Date(b.enterTime).getTime() - new Date(a.enterTime).getTime()
    );
    return sortedRooms[0].roomName;
  };

  const openUserDetail = (user: UserVR) => {
    setSelectedUser(user);
    const activeSession = getActiveSessionByUser(user.id);
    setSelectedSession(activeSession); // Hanya ambil session yang isActive
  };

  const closeModal = () => {
    setSelectedUser(null);
    setSelectedSession(null);
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
            <th className="border border-gray-300 px-4 py-2 text-left">
              Perangkat
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Ruang Terakhir
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const activeSession = getActiveSessionByUser(user.id);
            const lastRoom = getLastRoomName(activeSession);

            return (
              <tr
                key={user.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => openUserDetail(user)}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {user.fullName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.email}
                </td>
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
                <td className="border border-gray-300 px-4 py-2">
                  {activeSession?.device || "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {activeSession ? lastRoom : "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center text-blue-600 underline">
                  Lihat Detail
                </td>
              </tr>
            );
          })}
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
                Sesi VR {selectedUser.fullName}
              </h2>

              {!selectedSession && (
                <p>Pengguna ini sedang tidak aktif di VR.</p>
              )}

              {selectedSession && (
                <>
                  <p>
                    <strong>ID Sesi:</strong> {selectedSession.sessionId}
                  </p>
                  <p>
                    <strong>Perangkat:</strong> {selectedSession.device}
                  </p>
                  <p>
                    <strong>Durasi:</strong>{" "}
                    {formatDuration(selectedSession.duration)}
                  </p>
                  <p>
                    <strong>Waktu Mulai:</strong>{" "}
                    {new Date(selectedSession.startTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Waktu Selesai:</strong>{" "}
                    {new Date(selectedSession.endTime).toLocaleString()}
                  </p>

                  <div className="mt-4">
                    <strong>Ruang yang Dikunjungi:</strong>
                    {selectedSession.roomHistory?.length ? (
                      <ul className="list-disc list-inside">
                        {selectedSession.roomHistory.map((room) => (
                          <li key={room.roomId}>
                            {room.roomName} (
                            {new Date(room.enterTime).toLocaleTimeString()} -{" "}
                            {new Date(room.exitTime).toLocaleTimeString()})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>-</p>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VRSessionAdmin;
