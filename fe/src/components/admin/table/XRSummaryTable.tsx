import { Link } from "react-router";
import { useDeleteVrSessionPerId } from "../../../app/store/VrSessionStore";
import type { VRSession } from "../../../type/VRdata";

interface XRSummaryTableProps {
  data: VRSession[];
}

export default function XRSummaryTable({ data }: XRSummaryTableProps) {
  // custom hook delete (nggak perlu langsung passing sessionId)
  const deleteMutation = useDeleteVrSessionPerId();

  return (
    <div className="overflow-x-auto bg-base-100 p-4 rounded-xl shadow">
      <table className="table table-zebra min-w-[600px]">
        <thead>
          <tr>
            <th>Nama Pasien</th>
            <th>Durasi</th>
            <th>Hotspot</th>
            <th>Device</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s) => (
            <tr key={s.sessionId} className="hover">
              <td>{s.user?.fullName || "-"}</td>
              <td>
                {Math.floor(s.duration / 60)}m {s.duration % 60}s
              </td>
              {/* 🔑 ganti hotspots -> interactions.length */}
              <td>{s.interactions?.length ? s.interactions.length : "-"}</td>
              <td>{s.device || "-"}</td>
              <td className="flex gap-2">
                <Link
                  to={`/admin/analytics/${s.sessionId}`}
                  className="btn btn-sm btn-primary"
                >
                  Detail
                </Link>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => deleteMutation.mutate(s.sessionId)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "..." : "Hapus"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
