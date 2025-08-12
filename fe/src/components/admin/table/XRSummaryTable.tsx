// src/components/admin/table/XRSummaryTable.tsx
import { Link } from "react-router";
import type { VRSession } from "../../../type/VRdata";

interface XRSummaryTableProps {
  data: VRSession[];
}

export default function XRSummaryTable({ data }: XRSummaryTableProps) {
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
              <td>{s.name || "-"}</td>
              <td>
                {Math.floor(s.duration / 60)}m {s.duration % 60}s
              </td>
              <td>
                {s.hotspots && s.hotspots.length > 0
                  ? s.hotspots.join(", ")
                  : "-"}
              </td>
              <td>{s.device || "-"}</td>
              <td>
                <Link
                  to={`/admin/analytics/${s.sessionId}`}
                  className="btn btn-sm btn-primary"
                >
                  Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
