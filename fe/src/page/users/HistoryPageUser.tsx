import { useState } from "react";
import type { VRSession } from "../../type/VRdata";
import HistoryDetailUser from "../../components/users/history/HistoryDetailUser";
import HistoryTableUser from "../../components/users/history/HistoryTableUser";
import { userSessions } from "../../data/VRsession";

export default function HistoryPageUser() {
  const [selected, setSelected] = useState<VRSession | null>(null);

  return (
    <div className="p-4 space-y-4">
      <HistoryTableUser
        data={userSessions}
        onSelect={(session) => setSelected(session)}
      />

      {selected && (
        <HistoryDetailUser
          session={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
