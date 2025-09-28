import { useState } from "react";
import type { VRSession } from "../../../type/VRdata";

interface HistoryTableUserProps {
  data: VRSession[];
  onSelect: (session: VRSession) => void;
}

// 🔹 Helper untuk format durasi
function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return "-";

  if (seconds < 60) {
    return `${seconds} detik`;
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)} menit ${seconds % 60} detik`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} jam ${minutes} menit`;
  }
}

export default function HistoryTableUser({
  data,
  onSelect,
}: HistoryTableUserProps) {
  const [page, setPage] = useState(1);
  const pageSize = 7;

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginated = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / pageSize);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Riwayat Sesi</h2>
      <table className="table w-full">
        <thead>
          <tr>
            <th>No</th>
            <th>Session ID</th>
            <th>Waktu Mulai</th>
            <th>Durasi</th>
            <th>Device</th>
            <th>Hotspot / Ruangan</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((session, idx) => (
            <tr key={session.sessionId}>
              <td>{startIndex + idx + 1}</td>
              <td>{session.sessionId}</td>
              <td>{new Date(session.startTime).toLocaleString()}</td>
              <td>{formatDuration(session.duration)}</td>
              <td>{session.device || "-"}</td>
              <td>
                {session.hotspots?.join(", ") ||
                  session.roomHistory?.map((r) => r.roomName).join(", ") ||
                  "-"}
              </td>
              <td>
                <button
                  onClick={() => onSelect(session)}
                  className="btn btn-sm btn-primary bg-pink-500 hover:bg-pink-600 border-none"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
          {paginated.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-3 py-1 rounded ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
          >
            ⬅ Prev
          </button>

          <span>
            Menampilkan {startIndex + 1} - {Math.min(endIndex, data.length)}{" "}
            dari {data.length} data
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-3 py-1 rounded ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
}
