import { useState } from "react";
import { adminSessions } from "../../data/VRsession";
import { dummyUsers, type User } from "../../type/user";
import type { VRSession } from "../../type/VRdata";
import { motion, AnimatePresence } from "framer-motion";

const isSessionActive = (session: VRSession) => {
  const now = new Date();
  return new Date(session.startTime) <= now && now <= new Date(session.endTime);
};

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m} menit ${s} detik`;
};

const VRSessionAdmin = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedSession, setSelectedSession] = useState<VRSession | null>(
    null
  );

  const getActiveSessionByUser = (userId: number): VRSession | null => {
    const sessions = adminSessions
      .filter((s) => s.userId === userId.toString() && isSessionActive(s))
      .sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
    return sessions.length > 0 ? sessions[0] : null;
  };

  const getLastRoomName = (session: VRSession | null): string => {
    if (!session || !session.roomHistory || session.roomHistory.length === 0)
      return "-";
    const sortedRooms = [...session.roomHistory].sort(
      (a, b) =>
        new Date(b.enterTime).getTime() - new Date(a.enterTime).getTime()
    );
    return sortedRooms[0].roomName;
  };

  const openUserDetail = (user: User) => {
    setSelectedUser(user);
    const activeSession = getActiveSessionByUser(user.id);
    setSelectedSession(activeSession);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setSelectedSession(null);
  };

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
          {dummyUsers.map((user) => {
            const activeSession = getActiveSessionByUser(user.id);
            const isActive = !!activeSession;
            const lastRoom = getLastRoomName(activeSession);

            return (
              <tr
                key={user.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => openUserDetail(user)}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {user.name}
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
                    isActive ? "text-green-700" : "text-red-500"
                  }`}
                >
                  {isActive ? "Sedang Login" : "Tidak Login"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {activeSession?.device || "-"}
                </td>
                <td className="border border-gray-300 px-4 py-2">{lastRoom}</td>
                <td className="border border-gray-300 px-4 py-2 text-center text-blue-600 underline">
                  Lihat Detail
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <AnimatePresence>
        {(selectedUser || selectedSession) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-red-600 font-bold text-xl cursor-pointer"
                aria-label="Tutup modal"
              >
                &times;
              </button>

              <h2 className="text-2xl font-bold mb-4">
                Sesi Login {selectedUser?.name}
              </h2>

              {!selectedSession && <p>Pengguna ini sedang tidak login.</p>}

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
                    {selectedSession.roomHistory &&
                    selectedSession.roomHistory.length > 0 ? (
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VRSessionAdmin;
