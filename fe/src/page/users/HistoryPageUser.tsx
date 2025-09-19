import { useState } from "react";
import HistoryDetailUser from "../../components/users/history/HistoryDetailUser";
import HistoryTableUser from "../../components/users/history/HistoryTableUser";
import { useUserProfile } from "../../app/store/UserStore";
import { useVRSessionAllbyUser } from "../../app/store/VrSessionStore";

export default function HistoryPageUser() {
  // ⬅️ simpan sessionId saja, bukan full session
  const [selected, setSelected] = useState<string | null>(null);

  const { data: user, isLoading } = useUserProfile();
  console.log("user", user);

  const {
    data: sessions,
    isLoading: sessionsLoading,
    isError,
    error,
  } = useVRSessionAllbyUser(user?.id || "");

  if (isLoading || sessionsLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <div className="p-4 space-y-4">
      <HistoryTableUser
        data={sessions || []}
        onSelect={(session) => setSelected(session.sessionId)} // ⬅️ kirim sessionId
      />

      {selected && (
        <HistoryDetailUser
          sessionId={selected} // ⬅️ Detail fetch sendiri
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
