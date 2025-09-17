// src/pages/admin/Analytic.tsx
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useVRSessionAllbyAdmin } from "../../app/store/VrSessionStore";
import XRSummaryTable from "../../components/admin/table/XRSummaryTable";
import type { VRSession } from "../../type/VRdata";

// Helper format durasi
function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return "-";
  if (seconds < 60) return `${seconds} detik`;
  if (seconds < 3600)
    return `${Math.floor(seconds / 60)} menit ${seconds % 60} detik`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours} jam ${minutes} menit`;
}

// Tipe filter
type DateFilter = "all" | "today" | "week" | "month";

// Filter tanggal
function filterByDate(sessions: VRSession[], filter: DateFilter): VRSession[] {
  const now = new Date();
  return sessions.filter((s) => {
    const d = new Date(s.startTime);
    switch (filter) {
      case "today":
        return d.toDateString() === now.toDateString();
      case "week": {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo && d <= now;
      }
      case "month": {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return d >= monthAgo && d <= now;
      }
      default:
        return true; // all
    }
  });
}

export default function Analytic() {
  const { data: sessions = [], isLoading } = useVRSessionAllbyAdmin();
  const [filter, setFilter] = useState<DateFilter>("all");

  const filteredSessions = useMemo(
    () => filterByDate(sessions, filter),
    [sessions, filter]
  );

  const totalSessions = filteredSessions.length;
  const uniqueUsers = new Set(filteredSessions.map((s) => s.userId)).size;
  const avgDuration =
    Math.floor(
      filteredSessions.reduce((acc, cur) => acc + cur.duration, 0) /
        (totalSessions || 1)
    ) || 0;

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold">Analitik VR Sessions</h1>

      {/* Filter Card */}
      <div className="bg-base-200 p-4 rounded-lg shadow flex flex-wrap gap-2 items-center">
        <span className="font-semibold mr-2">Filter:</span>
        {(["all", "today", "week", "month"] as DateFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition-colors font-medium cursor-pointer ${
              filter === f
                ? "bg-primary text-white shadow"
                : "bg-white text-gray-700 hover:bg-primary hover:text-white"
            }`}
          >
            {f === "all"
              ? "Semua"
              : f === "today"
              ? "Hari ini"
              : f === "week"
              ? "Minggu ini"
              : "Bulan ini"}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
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
          <div className="stat-value">{formatDuration(avgDuration)}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-base-100 p-4 rounded-lg shadow">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <XRSummaryTable data={filteredSessions} />
        )}
      </div>
    </motion.div>
  );
}
