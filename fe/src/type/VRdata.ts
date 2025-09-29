// src/type/VRdata.ts
import type { User } from "./user";

export interface RoomVisit {
  roomId: string;
  roomName: string;
  enterTime: string;
  exitTime: string;
}

export interface CameraRotation {
  timeStamp: string;
  rotX: number;
  rotY: number;
}

/** Simple Task DTO sent to BE for reporting / summaries */
export interface Task {
  taskId: string;
  taskName: string;
  description: string;
  sceneId: string;
  status: "completed" | "failed" | "pending";
  type: "interaction" | "navigation";
  timeSpent: number; // in seconds
}

/** AssignedTask is what BE uses / stores per-assignment (kept for compatibility) */
export interface AssignedTask {
  id: string; // cuid di BE (task.id)
  taskId: string;
  taskName: string;
  description: string;
  sceneId: string;
  status: "completed" | "failed" | "pending";
  timeSpent: number;
}

/** Interaction types */
export interface SceneOrHotspotInteraction {
  id: string;
  type: "scene" | "hotspot";
  targetId: string;
  targetName: string;
  targetType: string;
  timestamp: string;
}

/** TaskUpdateInteraction originally referenced Task[] | AssignedTask[].
    Extend it so it also accepts VRTaskSession[] (frontend full payload). */
export interface TaskUpdateInteraction {
  id: string;
  type: "taskUpdate";
  // allow Task[] | AssignedTask[] | VRTaskSession[] so frontend can include full task sessions
  targetTasks: Task[] | AssignedTask[] | VRTaskSession[];
  timestamp: string;
}

export type Interaction = SceneOrHotspotInteraction | TaskUpdateInteraction;

/** VRTaskSession: full frontend in-memory task/session record */
export type VRTaskSession = {
  taskId: string;
  taskName: string;
  assignedBy: string;
  description?: string;
  sceneId: string;
  duration?: number; // minutes (optional)
  status: "pending" | "inProgress" | "failed" | "completed" | "incomplete";
  type: "interaction" | "navigation";
  remaining?: number; // seconds
  startedAt?: string | null;
  finishedAt?: string | null;
  userId?: string;
  // optional local metadata
  createdAt?: string;
  updatedAt?: string;
};

/** VRSession: allow tasks to be either Task[] (summary) OR VRTaskSession[] (full) */
export interface VRSession {
  sessionId: string;
  userId: string;
  name?: string;
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  device?: string;
  previousSessionId?: string;
  hotspots?: string[];
  user?: User;
  roomHistory?: RoomVisit[];
  cameraRotations?: CameraRotation[];
  // <-- Accept Task[] OR full VRTaskSession[]
  tasks?: Task[] | VRTaskSession[];
  interactions?: Interaction[];
}

/** extras */
export interface VRSessionExtended extends VRSession {
  assignedTasks?: AssignedTask[];
  currentTask?: AssignedTask;
}

export type HostpotType = "navigation" | "exit" | "interaction" | "location";

export interface HotspotData {
  id: string;
  targetId: string;
  position: [number, number, number];
  direction: [number, number, number];
  type: HostpotType;
  name: string;
  icon?: string;
  label?: string;
}

export interface SceneData {
  id: string;
  name: string;
  locationId: string;
  image: string;
  hotspots: HotspotData[];
}

/** SceneTask used by admin UI */
export interface SceneTask {
  taskId: string;
  taskName: string;
  description: string;
  sceneId: string;
  locationId: string;
  type: "interaction" | "navigation";
}
