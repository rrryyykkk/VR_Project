import { useEffect } from "react";
import { useUpdateTask, useTasks } from "../../../app/store/TaskStore";
import { availableTask } from "../../../data/360data";

type Props = {
  currentSceneId: string; // ini dapet dari VR engine saat user pindah scene
};

export default function VRTaskWatcher({ currentSceneId }: Props) {
  const { data: tasks = [] } = useTasks();
  const updateTask = useUpdateTask();

  useEffect(() => {
    if (!currentSceneId) return;

    availableTask
      .filter((task) => task.sceneId === currentSceneId)
      .forEach((task) => {
        const sessionTask = tasks.find((t) => t.taskId === task.taskId);
        if (sessionTask && sessionTask.status === "inProgress") {
          updateTask.mutate({
            taskId: sessionTask.taskId,
            payload: {
              status: "completed",
              finishedAt: new Date().toISOString(),
              remaining: 0,
            },
          });
          console.log("✅ Task completed automatically:", sessionTask.taskName);
        }
      });
  }, [currentSceneId, tasks, updateTask]);

  return null; // cuma logic, ga render UI
}
