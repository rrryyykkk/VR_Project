import { useEffect, useRef } from "react";
import { useTasks, useUpdateTask } from "../../../app/store/TaskStore";
import type { VRTaskSession } from "../../../type/VRdata";
import type { VRRecorderHandle } from "./VRRecorder";

type Props = {
  recorderRef: React.RefObject<VRRecorderHandle | null>;
  isRecording: boolean;
  userId: string;
};

const formatTime = (sec?: number) =>
  sec === undefined
    ? ""
    : `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;

export default function VRTaskPanel({ isRecording }: Props) {
  const { data: tasks = [] } = useTasks();
  const updateTask = useUpdateTask();
  const lastTasksRef = useRef<VRTaskSession[]>([]);

  // simpan tasks terbaru di ref
  useEffect(() => {
    lastTasksRef.current = tasks;
  }, [tasks]);

  // countdown auto jalan (tiap detik)
  useEffect(() => {
    if (!isRecording) {
      // stop recording → semua task yg belum selesai jadi failed
      lastTasksRef.current.forEach((t) => {
        if (t.status === "inProgress") {
          updateTask.mutate({
            taskId: t.taskId,
            payload: {
              status: "failed",
              finishedAt: new Date().toISOString(),
              remaining: t.remaining ?? 0,
            },
          });
          console.log("❌ Task failed (record stopped):", t.taskName);
        }
      });
      return;
    }

    // countdown per detik untuk task yg ada timer
    const id = setInterval(() => {
      lastTasksRef.current.forEach((t) => {
        if (t.status === "inProgress" && t.remaining !== undefined) {
          const newRemaining = t.remaining - 1;
          updateTask.mutate({
            taskId: t.taskId,
            payload: {
              status: newRemaining <= 0 ? "failed" : "inProgress",
              remaining: Math.max(newRemaining, 0),
            },
          });
        }
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRecording, updateTask]);

  // log kalau tasks berubah
  useEffect(() => {
    if (JSON.stringify(lastTasksRef.current) !== JSON.stringify(tasks)) {
      console.log("Tasks changed:", tasks);
      lastTasksRef.current = tasks;
    }
  }, [tasks]);

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 p-4 rounded w-64 text-white z-50">
      <h4 className="font-bold mb-2">Tasks</h4>
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t.taskId} className="p-2 border rounded bg-black/40">
            <div className="flex justify-between">
              <span>{t.taskName}</span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  t.status === "pending"
                    ? "bg-gray-500"
                    : t.status === "inProgress"
                    ? "bg-blue-500"
                    : t.status === "failed"
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
              >
                {t.status}
              </span>
            </div>

            {/* tampilkan timer kalau ada */}
            {t.remaining !== undefined && (
              <div className="text-right text-xs mt-1">
                {formatTime(t.remaining)}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
