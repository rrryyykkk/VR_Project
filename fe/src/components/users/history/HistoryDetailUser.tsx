import type { VRSession } from "../../../type/VRdata";
import {
  AreaChart,
  Area,
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

interface Props {
  session: VRSession;
  onClose: () => void;
}

// Fungsi untuk normalisasi derajat (agar selalu di 0-360)
function normalizeDegree(angle: number): number {
  let deg = angle % 360;
  if (deg < 0) deg += 360;
  return deg;
}

export default function HistoryDetailUser({ session, onClose }: Props) {
  const movementData = (session.movementLogs || []).map((log) => {
    const distance = Math.sqrt(
      Math.pow(log.cameraX, 2) +
        Math.pow(log.cameraY, 2) +
        Math.pow(log.cameraZ, 2)
    );
    return {
      timestamp: new Date(log.timestamp).toLocaleTimeString(),
      movement: distance,
    };
  });

  const rotationData = (session.cameraRotations || []).map((rot) => ({
    timestamp: new Date(rot.timestamp).toLocaleTimeString(),
    upDown: normalizeDegree(rot.rotation.x),
    leftRight: normalizeDegree(rot.rotation.y),
    tilt: normalizeDegree(rot.rotation.z),
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
          <strong>👤 Nama:</strong> {session.name || session.userId}
        </p>
        <p>
          <strong>🕒 Waktu:</strong>{" "}
          {new Date(session.startTime).toLocaleString()} —{" "}
          {new Date(session.endTime).toLocaleString()}
        </p>
        <p>
          <strong>⏳ Durasi:</strong> {Math.floor(session.duration / 60)} menit
        </p>
        <p>
          <strong>💻 Device:</strong> {session.device || "-"}
        </p>
      </div>

      {/* Hotspots */}
      {session.hotspots && session.hotspots.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg">📍 Hotspots</h3>
          <ul className="list-disc ml-6">
            {session.hotspots.map((h, i) => (
              <li key={i}>{h}</li>
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

      {/* Chart Movement */}
      {movementData.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-2">🚶 Pergerakan Kamera</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={movementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) =>
                  typeof value === "number" ? `${value.toFixed(2)} m` : value
                }
              />
              <Legend wrapperStyle={{ fontSize: "14px" }} />
              <Area
                type="monotone"
                dataKey="movement"
                stroke="#4A90E2"
                fill="#4A90E2"
                name="Pergerakan (m)"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
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
              <Line
                type="monotone"
                dataKey="tilt"
                stroke="#50E3C2"
                name="Miring Kepala"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

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
