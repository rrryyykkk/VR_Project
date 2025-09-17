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
  return (
    <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Riwayat Sesi</h2>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Session ID</th>
            <th>Waktu Mulai</th>
            <th>Durasi</th>
            <th>Device</th>
            <th>Hotspot / Ruangan</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((session) => (
            <tr key={session.sessionId}>
              <td>{session.userId}</td>
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
        </tbody>
      </table>
    </div>
  );
}
