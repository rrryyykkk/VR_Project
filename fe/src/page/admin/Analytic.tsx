import { motion } from "framer-motion";
import StatCard from "../../components/admin/analystic/StatCard";
import { xrSessions } from "../../data/XrSession";
import XRSummaryTable from "../../components/admin/table/XRSummaryTable";

const Analytic = () => {
  const totalSessions = xrSessions.length;
  const avgDuration =
    Math.floor(
      xrSessions.reduce((a, b) => a + b.duration, 0) / xrSessions.length
    ) || 0;

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold">Analitik WebXR Pasien</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Sesi XR" value={totalSessions} />
        <StatCard
          label="Pasien Unik"
          value={new Set(xrSessions.map((s) => s.userId)).size}
        />
        <StatCard
          label="Durasi Rata-rata"
          value={`${Math.floor(avgDuration / 60)}m ${avgDuration % 60}s`}
        />
      </div>

      {/* Table */}
      <XRSummaryTable />
    </motion.div>
  );
};

export default Analytic;
