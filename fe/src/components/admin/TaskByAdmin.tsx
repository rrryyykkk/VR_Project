// src/components/admin/TaskByAdmin.tsx
import { useState } from "react";
import { availableTask } from "../../data/360data";
import type { UserVR } from "../../type/user";
import type { SceneTask, VRTaskSession } from "../../type/VRdata";
import { useAssignTasks } from "../../app/store/TaskStore";

type Props = {
  user: UserVR;
  onAssign?: (tasks: VRTaskSession[]) => void;
};

// ✅ format detik → menit:detik
const formatTime = (seconds?: number) => {
  if (!seconds) return "No Limit";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export default function TaskByAdmin({ user, onAssign }: Props) {
  const [selected, setSelected] = useState<VRTaskSession[]>([]);
  const assignTasks = useAssignTasks(user.id);

  const toggleTask = (task: SceneTask, durationMin?: number) => {
    // ✅ simpan dalam detik
    const durationSec = durationMin ? durationMin * 60 : undefined;
    const exists = selected.find((t) => t.taskId === task.taskId);

    if (exists) {
      setSelected(selected.filter((t) => t.taskId !== task.taskId));
    } else {
      setSelected([
        ...selected,
        {
          ...task,
          assignedBy: "admin-01",
          duration: durationSec, // simpan detik
          remaining: durationSec, // simpan detik
          status: "inProgress" as const,
          startedAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const startAssign = () => {
    if (selected.length === 0) return;

    const payload: VRTaskSession[] = selected.map((t) => ({
      ...t,
      status: "inProgress" as const,
      remaining: t.duration, // ✅ langsung detik
      startedAt: t.startedAt ?? new Date().toISOString(),
      userId: user.id,
    }));

    assignTasks.mutate(payload, {
      onSuccess: (tasks) => onAssign?.(tasks),
      onError: (err) => console.error("❌ Error assigning tasks:", err),
    });
  };

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-bold">Assign Tasks for {user.fullName}</h3>

      <div className="grid gap-4">
        {availableTask.map((task) => {
          const sel = selected.find((t) => t.taskId === task.taskId);
          return (
            <div
              key={task.taskId}
              className={`p-4 rounded-lg border shadow-sm transition flex flex-col gap-2 ${
                sel
                  ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-500"
                  : "bg-white hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!sel}
                    onChange={() => toggleTask(task)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 font-medium">{task.taskName}</span>
                </label>

                <span className="text-sm text-gray-600">
                  {sel ? formatTime(sel.remaining) : "No Limit"}
                </span>
              </div>

              {sel && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <label>Set Timer:</label>
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={(sel.duration ?? 0) / 60} // tampilkan menit
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      const durationSec = val > 0 ? val * 60 : undefined;
                      setSelected((prev) =>
                        prev.map((t) =>
                          t.taskId === task.taskId
                            ? {
                                ...t,
                                duration: durationSec, // simpan detik
                                remaining: durationSec, // simpan detik
                              }
                            : t
                        )
                      );
                    }}
                  >
                    <option value={0}>No Limit</option>
                    <option value={3}>3 menit</option>
                    <option value={5}>5 menit</option>
                    <option value={10}>10 menit</option>
                    <option value={15}>15 menit</option>
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="bg-gray-50 border rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-sm text-gray-700">
            Selected Tasks
          </h4>
          <ul className="space-y-1 text-sm">
            {selected.map((t) => (
              <li key={t.taskId} className="flex justify-between">
                <span>{t.taskName}</span>
                <span className="text-gray-500">{formatTime(t.remaining)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={startAssign}
        disabled={selected.length === 0}
        className={`px-4 py-2 rounded w-full ${
          selected.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white font-medium`}
      >
        Assign {selected.length > 0 ? `(${selected.length})` : ""}
      </button>
    </div>
  );
}
