// src/app/store/TaskStore.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { VRTaskSession } from "../../type/VRdata";

export const TASKS_KEY = ["vr-tasks"];

// ---------------------------
// GET TASKS
// ---------------------------
export function useTasks(userId: string) {
  const qc = useQueryClient();

  return useQuery<VRTaskSession[]>({
    queryKey: [...TASKS_KEY, userId],
    queryFn: async () => {
      const cached =
        qc.getQueryData<VRTaskSession[]>([...TASKS_KEY, userId]) ?? [];
      console.log(`[useTasks] queryFn for user ${userId}, cached:`, cached);
      return cached;
    },
    initialData: () => {
      const init =
        qc.getQueryData<VRTaskSession[]>([...TASKS_KEY, userId]) ?? [];
      console.log(`[useTasks] initialData for user ${userId}:`, init);
      return init;
    },
    staleTime: Infinity,
  });
}

// ---------------------------
// SET TASKS (assign tasks from admin)
// ---------------------------
export function useSetTasks(userId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (tasks: VRTaskSession[]) => {
      console.log(`[useSetTasks] mutationFn for user ${userId}, tasks:`, tasks);
      return tasks; // FE-only, langsung balikin
    },
    onSuccess: (tasks) => {
      console.log(
        `[useSetTasks] onSuccess → setQueryData for user ${userId}:`,
        tasks
      );
      qc.setQueryData([...TASKS_KEY, userId], tasks);
    },
  });
}

// ---------------------------
// UPDATE TASK (start/finish task or countdown)
// ---------------------------
export function useUpdateTask(userId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (task: VRTaskSession) => {
      console.log(`[useUpdateTask] mutationFn for user ${userId}, task:`, task);
      return task;
    },
    onSuccess: (task) => {
      console.log(
        `[useUpdateTask] onSuccess update for user ${userId}, task:`,
        task
      );
      qc.setQueryData<VRTaskSession[]>([...TASKS_KEY, userId], (old = []) => {
        const updated = old.map((t) => (t.taskId === task.taskId ? task : t));
        console.log(
          `[useUpdateTask] updated cache for user ${userId}:`,
          updated
        );
        return updated;
      });
    },
  });
}
