// src/pages/admin/Analytic.tsx
import { motion } from "framer-motion";
import type { VRSession } from "../../type/VRdata";
import XRSummaryTable from "../../components/admin/table/XRSummaryTable";

interface AnalyticProps {
  sessions: VRSession[];
}

export default function Analytic({ sessions }: AnalyticProps) {
  const totalSessions = sessions.length;
  const uniqueUsers = new Set(sessions.map((s) => s.userId)).size;
  const avgDuration =
    Math.floor(
      sessions.reduce((acc, cur) => acc + cur.duration, 0) / totalSessions
    ) || 0;

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold">Analitik VR Sessions</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat bg-base-200 p-4 rounded-lg shadow">
          <div className="stat-title">Total Sesi</div>
          <div className="stat-value">{totalSessions}</div>
        </div>
        <div className="stat bg-base-200 p-4 rounded-lg shadow">
          <div className="stat-title">Pasien Unik</div>
          <div className="stat-value">{uniqueUsers}</div>
        </div>
        <div className="stat bg-base-200 p-4 rounded-lg shadow">
          <div className="stat-title">Durasi Rata-rata</div>
          <div className="stat-value">
            {Math.floor(avgDuration / 60)}m {avgDuration % 60}s
          </div>
        </div>
      </div>

      <XRSummaryTable data={sessions} />
    </motion.div>
  );
}
