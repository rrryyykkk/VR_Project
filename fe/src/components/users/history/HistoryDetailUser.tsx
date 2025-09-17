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
} from "recharts";
import { motion } from "framer-motion";
import { useVRSessionbySessionId } from "../../../app/store/VrSessionStore";

interface Props {
  sessionId: string;
  onClose: () => void;
}

// 🔹 Normalisasi derajat (0–360)
function normalizeDegree(angle: number): number {
  let deg = angle % 360;
  if (deg < 0) deg += 360;
  return deg;
}

// 🔹 Helper untuk format durasi
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

  // --- UI Loading ---
  if (isLoading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <p className="ml-4 text-blue-600 font-semibold">
          Memuat detail sesi...
        </p>
      </motion.div>
    );

  // --- UI Error ---
  if (isError)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-red-100 border border-red-300 rounded-lg text-center space-y-3"
      >
        <p className="text-red-600 font-semibold">❌ Gagal memuat data</p>
        <p className="text-red-500 text-sm">
          {error?.message || "Terjadi kesalahan"}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          onClick={onClose}
        >
          🔙 Kembali
        </motion.button>
      </motion.div>
    );

  if (!session) return <p>Data tidak ditemukan</p>;

  // 🔹 Siapkan data grafik dari BE (rotX / rotY)
  const rotationData = (session.cameraRotations || []).map((rot) => ({
    timestamp: new Date(rot.timeStamp).toLocaleTimeString(),
    upDown: normalizeDegree(rot.rotX ?? 0),
    leftRight: normalizeDegree(rot.rotY ?? 0),
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

      {/* Hotspots */}
      {session.interactions && session.interactions.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg">📍 Hotspots</h3>
          <ul className="list-disc ml-6">
            {session.interactions
              .filter((i) => i.type === "hotspot")
              .map((h, i) => (
                <li key={i}>Hotspot ID: {h.targetId}</li>
              ))}
          </ul>
        </div>
      )}

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
      {rotationData.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-2">📊 Gerakan Kamera</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rotationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) =>
                  typeof value === "number" ? `${value.toFixed(1)}°` : value
                }
              />
              <Legend wrapperStyle={{ fontSize: "14px" }} />
              <Line
                type="monotone"
                dataKey="upDown"
                stroke="#4A90E2"
                name="Gerakan Atas–Bawah"
              />
              <Line
                type="monotone"
                dataKey="leftRight"
                stroke="#F5A623"
                name="Gerakan Kiri–Kanan"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tombol kembali */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-secondary px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-700 text-white"
          onClick={onClose}
        >
          🔙 Kembali
        </motion.button>
      </div>
    </motion.div>
  );
}
