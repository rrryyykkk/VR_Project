import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { VRTaskSession } from "../../type/VRdata";
import {
  deleteTasksByUser,
  getAllTasks,
  saveTask,
  updateTask,
} from "../../utils/idb";

export const TASKS_KEY = ["vr-tasks"];
export type UpdateTaskPayload = {
  status: "completed" | "failed" | "inProgress";
  remaining?: number;
  startedAt?: string;
  finishedAt?: string;
  duration?: number;
};

// ---------------- GET TASKS ----------------
export function useTasks() {
  return useQuery<VRTaskSession[]>({
    queryKey: TASKS_KEY,
    queryFn: async () => {
      const tasks = await getAllTasks();
      console.log("[useTasks] fetched tasks:", tasks);
      return tasks;
    },
    staleTime: 10_000,
  });
}

// ---------------- ASSIGN TASKS ----------------
export function useAssignTasks(userId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (tasks: VRTaskSession[]) => {
      const tasksWithAssignedBy: VRTaskSession[] = tasks.map((t) => {
        const hasTimer = t.duration && t.duration > 0;

        return {
          ...t,
          assignedBy: "admin-01",
          userId,
          status: "inProgress" as const, // ✅ literal type
          remaining: hasTimer ? t.duration! * 60 : undefined,
          startedAt: new Date().toISOString(),
        };
      });

      await saveTask(tasksWithAssignedBy);

      console.log("✅ Tasks successfully saved to IndexedDB (with userId):");
      console.table(tasksWithAssignedBy);

      return tasksWithAssignedBy;
    },
    onSuccess: (tasks) => {
      qc.setQueryData(TASKS_KEY, tasks);
      console.log("Tasks assigned and state updated:", tasks);
    },
    onError: (err) => console.error("Error assigning tasks:", err),
  });
}

// ---------------- UPDATE TASK ----------------
export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      taskId: string;
      payload: UpdateTaskPayload;
    }) => {
      const payload = { ...params.payload };

      // kalau inProgress, set startedAt kalau belum ada
      if (payload.status === "inProgress" && !payload.startedAt) {
        payload.startedAt = new Date().toISOString();
      }

      // kalau completed atau failed, set finishedAt
      if (payload.status === "completed" || payload.status === "failed") {
        payload.finishedAt = new Date().toISOString();
      }

      return updateTask(params.taskId, payload);
    },
    onSuccess: (updatedTask) => {
      console.log("Task updated:", updatedTask);
      if (!updatedTask) return;
      qc.setQueryData<VRTaskSession[]>(TASKS_KEY, (old = []) =>
        old.map((t) =>
          t.taskId === updatedTask.taskId ? { ...t, ...updatedTask } : t
        )
      );
    },
    onError: (err) => console.error("Error updating task:", err),
  });
}

// ---------------- DELETE TASKS USER ----------------
export async function removeTasksForUser(userId: string) {
  await deleteTasksByUser(userId);
}
