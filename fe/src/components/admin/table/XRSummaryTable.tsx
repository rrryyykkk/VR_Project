import { Link } from "react-router";
import { xrSessions } from "../../../data/XrSession";

const XRSummaryTable = () => {
  return (
    <div className="overflow-x-auto bg-base-100 p-4 rounded-xl shadow">
      <table className="table table-zebra">
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
          {xrSessions.map((s) => (
            <tr key={s.sessionId}>
              <td>{s.name}</td>
              <td>
                {Math.floor(s.duration / 60)}m {s.duration % 60}s
              </td>
              <td>{s.hotspots.join(", ")}</td>
              <td>{s.device}</td>
              <td>
                <Link
                  to={`/admin/analytics/${s.userId}`}
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
};

export default XRSummaryTable;
