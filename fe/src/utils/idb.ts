import { openDB } from "idb";
import type { CameraRotation, VRTaskSession } from "../type/VRdata";

export const dbPromise = openDB("VRSessionDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("chunks")) {
      db.createObjectStore("chunks", { keyPath: "id", autoIncrement: true });
    }
    if (!db.objectStoreNames.contains("tasks")) {
      db.createObjectStore("tasks", { keyPath: "taskId" });
    }
  },
});

// ---------------- CHUNKS ----------------
export async function saveChunk(rotation: CameraRotation[]) {
  const db = await dbPromise;
  await db.add("chunks", { data: rotation });
}

export async function getAllChunks(): Promise<
  { id: number; data: CameraRotation[] }[]
> {
  const db = await dbPromise;
  return db.getAll("chunks");
}

export async function deleteAllChunks() {
  const db = await dbPromise;
  await db.clear("chunks");
}

// ---------------- TASKS ----------------
export async function saveTask(tasks: VRTaskSession[]) {
  const db = await dbPromise;
  const tx = db.transaction("tasks", "readwrite");
  for (const t of tasks) {
    tx.store.put(t);
  }
  await tx.done;

  console.log("✅ [IndexedDB] Tasks saved:", tasks);
}

export async function getAllTasks(): Promise<VRTaskSession[]> {
  const db = await dbPromise;
  return db.getAll("tasks");
}

export async function updateTask(
  taskId: string,
  data: Partial<VRTaskSession>
): Promise<VRTaskSession | undefined> {
  const db = await dbPromise;
  const tx = db.transaction("tasks", "readwrite");
  const task = await tx.store.get(taskId);
  if (task) {
    const updated = { ...task, ...data };
    await tx.store.put(updated);
    await tx.done;
    return updated;
  }
  await tx.done;
  return undefined;
}

export async function deleteTasksByUser(userId: string) {
  const db = await dbPromise;
  const tx = db.transaction("tasks", "readwrite");
  const allTasks = await tx.store.getAll();

  let deleted = 0;
  for (const t of allTasks) {
    if (t.userId === userId) {
      await tx.store.delete(t.taskId);
      deleted++;
    }
  }
  await tx.done;

  console.log(`🗑️ Deleted ${deleted} tasks for userId=${userId}`);
}
