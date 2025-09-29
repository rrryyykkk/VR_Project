import { useEffect, useRef } from "react";
import {
  useTasks,
  useUpdateTask,
  type UpdateTaskPayload,
} from "../../../app/store/TaskStore";
import type { VRTaskSession } from "../../../type/VRdata";
import type { VRRecorderHandle } from "./VRRecorder";

// 🕒 Format waktu jadi lebih manusiawi (3 Menit 5 Detik)
const formatDurationReadable = (sec?: number) => {
  if (sec === undefined) return "No Limit";

  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (h > 0) return `${h} Jam ${m} Menit ${s} Detik`;
  if (m > 0) return s > 0 ? `${m} Menit ${s} Detik` : `${m} Menit`;
  return `${s} Detik`;
};

type Props = {
  recorderRef: React.RefObject<VRRecorderHandle | null>;
  isRecording: boolean;
  userId: string;
};

export default function VRTaskPanel({ isRecording }: Props) {
  const { data: tasks = [] } = useTasks();
  const updateTask = useUpdateTask();
  const lastTasksRef = useRef<VRTaskSession[]>([]);

  useEffect(() => {
    lastTasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    if (!isRecording) return;

    const id = setInterval(() => {
      lastTasksRef.current.forEach((t) => {
        if (t.status !== "inProgress") return;

        const payload: UpdateTaskPayload = { status: "inProgress" };

        if (t.duration !== undefined) {
          const newRemaining = (t.remaining ?? t.duration) - 1; // sudah detik
          payload.remaining = Math.max(newRemaining, 0);

          if (newRemaining <= 0) {
            payload.status = "failed";
            payload.finishedAt = new Date().toISOString();
            payload.remaining = 0;
          }
        } else {
          if (!t.startedAt) {
            payload.status = "inProgress";
            payload.startedAt = new Date().toISOString();
          } else {
            return;
          }
        }

        updateTask.mutate({ taskId: t.taskId, payload });
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRecording, updateTask]);

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
                  t.status === "inProgress"
                    ? "bg-blue-500"
                    : t.status === "failed"
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
              >
                {t.status}
              </span>
            </div>
            {t.remaining !== undefined && (
              <div className="text-right text-xs mt-1">
                {formatDurationReadable(t.remaining)}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
