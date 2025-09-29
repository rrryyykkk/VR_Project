// src/app/store/TaskStore.ts
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
  status: VRTaskSession["status"];
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
        // IMPORTANT:
        // - `t.duration` is expected to already be in seconds (as set by TaskByAdmin).
        // - therefore we must NOT multiply by 60 again.
        const hasTimer = typeof t.duration === "number" && t.duration > 0;

        return {
          ...t,
          assignedBy: "admin-01",
          userId,
          status: "inProgress" as const,
          // <-- FIX: don't multiply by 60 if duration already in seconds
          remaining: hasTimer ? t.duration! : undefined,
          startedAt: new Date().toISOString(),
        };
      });

      await saveTask(tasksWithAssignedBy);

      console.table(tasksWithAssignedBy);

      return tasksWithAssignedBy;
    },
    onSuccess: (tasks) => {
      qc.setQueryData(TASKS_KEY, tasks);
    },
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
      if (!updatedTask) return;
      qc.setQueryData<VRTaskSession[]>(TASKS_KEY, (old = []) =>
        old.map((t) =>
          t.taskId === updatedTask.taskId ? { ...t, ...updatedTask } : t
        )
      );
    },
  });
}

// ---------------- DELETE TASKS USER ----------------
export async function removeTasksForUser(userId: string) {
  await deleteTasksByUser(userId);
}
