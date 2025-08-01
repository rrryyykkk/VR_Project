import { motion } from "framer-motion";
import { xrSessions } from "../../data/XrSession";
import { RotationGraph } from "../../components/admin/analystic/RotationGraph";
import { useParams } from "react-router";

const AnalyticById = () => {
  const { id } = useParams();
  const session = xrSessions.find((s) => s.userId === id);

  if (!session) return <div className="p-6">❌ Data tidak ditemukan</div>;

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold">Detail Analitik: {session.name}</h2>

      {/* Info Cards */}
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Durasi Sesi</div>
          <div className="stat-value">
            {Math.floor(session.duration / 60)}m {session.duration % 60}s
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Perangkat</div>
          <div className="stat-value">{session.device}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Sesi Sebelumnya</div>
          <div className="stat-value">
            {session.previousSessionId || "Tidak ada"}
          </div>
        </div>
      </div>

      {/* Hotspot */}
      <div className="bg-base-100 p-4 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-2">Hotspot yang Dikunjungi</h3>
        <ul className="list-disc list-inside">
          {session.hotspots.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>

      {/* Rotasi */}
      <div className="bg-base-100 p-4 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Riwayat Rotasi Kamera</h3>
        <RotationGraph data={session.cameraRotations} />
      </div>
    </motion.div>
  );
};

export default AnalyticById;
