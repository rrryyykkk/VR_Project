import { useEffect } from "react";
import type { VRRecorderHandle } from "./VRRecorder";
import { useTasks, useUpdateTask } from "../../../app/store/TaskStore";
import type { VRTaskSession } from "../../../type/VRdata";

type Props = {
  recorderRef: React.RefObject<VRRecorderHandle | null>;
  isRecording: boolean;
  userId: string;
};

const formatTime = (sec?: number) =>
  sec === undefined
    ? ""
    : `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;

export default function VRTaskPanel({
  recorderRef,
  isRecording,
  userId,
}: Props) {
  const { data: tasks = [] } = useTasks(userId);
  const updateTask = useUpdateTask(userId);

  // log tasks ke console
  useEffect(() => {
    console.log("[VRTaskPanel] tasks for user:", userId, tasks);
  }, [tasks, userId]);

  // countdown timer untuk task inProgress
  useEffect(() => {
    if (!isRecording) return;
    const id = setInterval(() => {
      tasks.forEach((t) => {
        if (t.status === "inProgress" && t.remaining) {
          if (t.remaining <= 1) {
            updateTask.mutate({ ...t, remaining: 0, status: "failed" });
          } else {
            updateTask.mutate({ ...t, remaining: t.remaining - 1 });
          }
        }
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRecording, tasks, updateTask]);

  // start task
  const startTask = (t: VRTaskSession) =>
    updateTask.mutate({
      ...t,
      status: t.duration ? "inProgress" : "completed",
      remaining: t.duration ? t.duration * 60 : undefined,
    });

  // finish task
  const finishTask = (t: VRTaskSession) =>
    updateTask.mutate({ ...t, status: "completed", remaining: 0 });

  // kirim update ke recorder
  useEffect(() => {
    recorderRef.current?.logInteraction("taskUpdate", { tasks });
  }, [tasks, recorderRef]);

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
            {t.duration && t.status === "inProgress" && (
              <div className="text-right text-xs mt-1">
                {formatTime(t.remaining)}
              </div>
            )}
            {t.status === "pending" && (
              <button
                className="mt-1 w-full bg-blue-600 rounded px-2 py-1 text-sm"
                onClick={() => startTask(t)}
              >
                Start
              </button>
            )}
            {t.status === "inProgress" && (
              <button
                className="mt-1 w-full bg-green-600 rounded px-2 py-1 text-sm"
                onClick={() => finishTask(t)}
              >
                Finish
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
