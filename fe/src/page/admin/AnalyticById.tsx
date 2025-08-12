import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router";
import { adminSessions } from "../../data/VRsession";
import StatCard from "../../components/admin/analystic/StatCard";
import { RotationGraph } from "../../components/admin/analystic/RotationGraph";

const AnalyticById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = adminSessions.find((s) => s.sessionId === id);

  if (!session) return <div className="p-6">❌ Data tidak ditemukan</div>;

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h2 className="text-2xl font-bold mb-4">Detail Analitik: {session.name}</h2>

      {/* Statistik utama */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Durasi Sesi"
          value={`${Math.floor(session.duration / 60)}m ${session.duration % 60}s`}
        />
        <StatCard label="Perangkat" value={session.device || "-"} />
        <StatCard label="Sesi Sebelumnya" value={session.previousSessionId || "Tidak ada"} />
      </div>

      {/* Hotspots */}
      <section className="bg-base-100 p-4 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-2">Hotspot yang Dikunjungi</h3>
        <ul className="list-disc list-inside">
          {session.hotspots && session.hotspots.length > 0 ? (
            session.hotspots.map((h, i) => <li key={i}>{h}</li>)
          ) : (
            <li>-</li>
          )}
        </ul>
      </section>

      {/* Riwayat Ruangan */}
      {session.roomHistory && session.roomHistory.length > 0 && (
        <section className="bg-base-100 p-4 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-2">Riwayat Ruangan</h3>
          <ul className="list-disc list-inside">
            {session.roomHistory.map((r, i) => (
              <li key={i}>
                {r.roomName} ({new Date(r.enterTime).toLocaleTimeString()} -{" "}
                {new Date(r.exitTime).toLocaleTimeString()})
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tugas */}
      {session.tasks && session.tasks.length > 0 && (
        <section className="bg-base-100 p-4 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-2">Tugas</h3>
          <ul className="list-disc list-inside">
            {session.tasks.map((t, i) => (
              <li key={i}>
                {t.taskName} - <em>{t.status}</em> ({t.timeSpent}s)
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Grafik rotasi kamera */}
      <section className="bg-base-100 p-4 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Riwayat Rotasi Kamera</h3>
        <RotationGraph data={session.cameraRotations || []} />
      </section>

      {/* Tombol kembali */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/admin/analytics")}
          className="btn btn-secondary px-4 py-2 rounded-lg"
        >
          🔙 Kembali ke Daftar
        </button>
      </div>
    </motion.div>
  );
};

export default AnalyticById;
