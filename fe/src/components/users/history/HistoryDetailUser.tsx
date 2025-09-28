// src/components/user/history/HistoryDetailUser.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush,
} from "recharts";
import { motion } from "framer-motion";
import { useVRSessionbySessionId } from "../../../app/store/VrSessionStore";
import dayjs from "dayjs";

interface Props {
  sessionId: string;
  onClose: () => void;
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return "-";
  if (seconds < 60) return `${seconds} detik`;
  if (seconds < 3600)
    return `${Math.floor(seconds / 60)} menit ${seconds % 60} detik`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours} jam ${minutes} menit`;
}

export default function HistoryDetailUser({ sessionId, onClose }: Props) {
  const {
    data: session,
    isLoading,
    isError,
    error,
  } = useVRSessionbySessionId(sessionId);
  console.log("sessionDetail", session);

  // --- Loading UI ---
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
        <p className="ml-4 text-blue-600 font-semibold">
          Memuat detail sesi...
        </p>
      </div>
    );

  // --- Error UI ---
  if (isError)
    return (
      <div className="p-6 bg-red-100 border border-red-300 rounded-lg text-center space-y-3">
        <p className="text-red-600 font-semibold">❌ Gagal memuat data</p>
        <p className="text-red-500 text-sm">
          {error?.message || "Terjadi kesalahan"}
        </p>
        <button
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          onClick={onClose}
        >
          🔙 Kembali
        </button>
      </div>
    );

  if (!session) return <p>Data tidak ditemukan</p>;

  // 🔹 Format data rotasi kamera
  const formatted = (session.cameraRotations || []).map((rot) => ({
    time: dayjs(rot.timeStamp).format("HH:mm:ss"),
    fullTime: dayjs(rot.timeStamp).format("YYYY-MM-DD HH:mm:ss"),
    x: Number((rot.rotX ?? 0).toFixed(2)),
    y: Number((rot.rotY ?? 0).toFixed(2)),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md rounded-lg p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-blue-700">📜 Detail Sesi VR</h2>

      {/* Info Umum */}
      <div className="space-y-1 text-lg">
        <p>
          <strong>👤 Nama:</strong> {session.user?.fullName || session.userId}
        </p>
        <p>
          <strong>🕒 Waktu:</strong>{" "}
          {new Date(session.startTime).toLocaleString()} —{" "}
          {new Date(session.endTime).toLocaleString()}
        </p>
        <p>
          <strong>⏳ Durasi:</strong> {formatDuration(session.duration)}
        </p>
        <p>
          <strong>💻 Device:</strong> {session.device || "-"}
        </p>
      </div>

      {/* Hotspots / Interactions */}
      <section className="bg-base-100 p-4 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-2">Interaksi</h3>
        {session.interactions?.length ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Tipe</th>
                  <th>Target</th>
                  <th>Kategori</th>
                </tr>
              </thead>
              <tbody>
                {session.interactions.map((h) => {
                  if (h.type === "scene" || h.type === "hotspot") {
                    return (
                      <tr key={h.id}>
                        <td>{new Date(h.timestamp).toLocaleTimeString()}</td>
                        <td className="capitalize">{h.type}</td>
                        <td>{h.targetName || h.targetId || "-"}</td>
                        <td>{h.targetType || "-"}</td>
                      </tr>
                    );
                  }

                  if (h.type === "taskUpdate") {
                    return (
                      <tr key={h.id}>
                        <td>{new Date(h.timestamp).toLocaleTimeString()}</td>
                        <td className="capitalize">{h.type}</td>
                        <td colSpan={2}>
                          Update Tugas (
                          {Array.isArray(h.targetTasks)
                            ? h.targetTasks.length
                            : 0}{" "}
                          task)
                        </td>
                      </tr>
                    );
                  }

                  return null;
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">-</p>
        )}
      </section>

      {/* Riwayat Ruangan */}
      {session.roomHistory && session.roomHistory.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg">🏠 Riwayat Ruangan</h3>
          <ul className="list-disc ml-6">
            {session.roomHistory.map((r, i) => (
              <li key={i}>
                {r.roomName} ({new Date(r.enterTime).toLocaleTimeString()} →{" "}
                {new Date(r.exitTime).toLocaleTimeString()})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tugas */}
      {session.tasks && session.tasks.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg">📝 Tugas</h3>
          <ul className="list-disc ml-6">
            {session.tasks.map((t, i) => (
              <li key={i}>
                {t.taskName} - {t.status} ({t.timeSpent}s)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chart Rotasi */}
      {formatted.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-2">📊 Gerakan Kamera</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={formatted}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label, payload) =>
                  payload && payload.length > 0
                    ? payload[0].payload.fullTime
                    : label
                }
                formatter={(value) =>
                  typeof value === "number" ? `${value}°` : value
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="x"
                stroke="#4A90E2"
                name="Rotasi X (Atas–Bawah)"
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#F5A623"
                name="Rotasi Y (Kiri–Kanan)"
                dot={false}
                isAnimationActive={false}
              />
              <Brush dataKey="time" height={25} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tombol kembali */}
      <div className="flex justify-end">
        <button
          className="btn btn-secondary px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-700 text-white"
          onClick={onClose}
        >
          🔙 Kembali
        </button>
      </div>
    </motion.div>
  );
}
