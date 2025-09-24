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

export interface Task {
  taskId: string;
  taskName: string;
  description: string;
  status: "completed" | "failed" | "pending";
  type: "interaction" | "navigation";
  timeSpent: number; // in seconds
}

export interface AssignedTask {
  id: string; // cuid di BE (task.id)
  taskId: string;
  taskName: string;
  description: string;
  sceneId: string;
  status: "completed" | "failed" | "pending";
  timeSpent: number;
}

// Union type untuk interactions
export interface SceneOrHotspotInteraction {
  id: string;
  type: "scene" | "hotspot";
  targetId: string;
  targetName: string;
  targetType: string;
  timestamp: string;
}

export interface TaskUpdateInteraction {
  id: string;
  type: "taskUpdate";
  targetTasks: Task[] | AssignedTask[];
  timestamp: string;
}

export type Interaction = SceneOrHotspotInteraction | TaskUpdateInteraction;

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
  tasks?: Task[];
  interactions?: Interaction[];
}

// VRdata.ts
export type VRTaskSession = {
  taskId: string;
  taskName: string;
  assignedBy: string;
  duration?: number; // menit
  status: "pending" | "inProgress" | "failed" | "completed" | "incomplete";
  remaining?: number; // detik
};

export interface VRSessionExtended extends VRSession {
  assignedTasks?: AssignedTask[];
  currentTask?: AssignedTask;
}

export type HostpotType = "navigation" | "exit" | "interaction" | "location";

export interface HotspotData {
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

// hasil ekstrak scene Task dari scene Data
export interface SceneTask {
  taskId: string;
  taskName: string;
  description: string;
  sceneId: string;
  locationId: string;
  type: "interaction" | "navigation";
}
