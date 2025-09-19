// src/pages/admin/AnalyticById.tsx
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router";
import { useVRSessionbySessionId } from "../../app/store/VrSessionStore";
import StatCard from "../../components/admin/analystic/StatCard";
import { RotationGraph } from "../../components/admin/analystic/RotationGraph";

const AnalyticById = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Ambil data VR session dari backend
  const { data: session, isLoading, isError } = useVRSessionbySessionId(id!);
  console.log("session", session);

  // ⚡ Default fallback array
  const roomHistory = session?.roomHistory || [];

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-4 text-lg text-gray-700">Loading data...</span>
      </div>
    );

  if (isError || !session)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-6 rounded-lg flex items-center justify-center h-64">
        <span className="text-lg font-semibold">
          ❌ Data tidak ditemukan atau terjadi kesalahan.
        </span>
      </div>
    );

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h2 className="text-2xl font-bold mb-4">
        Detail Analitik: {session.user?.fullName || "-"}
      </h2>

      {/* Statistik utama */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Durasi Sesi"
          value={`${Math.floor(session.duration / 60)}m ${
            session.duration % 60
          }s`}
        />
        <StatCard label="Perangkat" value={session.device || "-"} />
        <StatCard
          label="Sesi Sebelumnya"
          value={session.previousSessionId || "Tidak ada"}
        />
      </div>

      {/* Hotspots → pakai interactions */}
      <section className="bg-base-100 p-4 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-2">Hotspot yang Dikunjungi</h3>
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
                {session.interactions.map((h) => (
                  <tr key={h.id}>
                    <td>{new Date(h.timestamp).toLocaleTimeString()}</td>
                    <td className="capitalize">{h.type}</td>
                    <td>{h.targetName || h.targetId || "-"}</td>
                    <td>{h.targetType || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">-</p>
        )}
      </section>

      {/* Riwayat Ruangan */}
      {roomHistory.length > 0 && (
        <section className="bg-base-100 p-4 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-2">Riwayat Ruangan</h3>
          <ul className="list-disc list-inside">
            {roomHistory.map((r) => (
              <li key={r.roomId}>
                {r.roomName} ({new Date(r.enterTime).toLocaleTimeString()} -{" "}
                {new Date(r.exitTime).toLocaleTimeString()})
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
          className="btn btn-secondary px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          🔙 Kembali ke Daftar
        </button>
      </div>
    </motion.div>
  );
};

export default AnalyticById;
