// types/VRSession.ts
export interface RoomVisit {
  roomId: string;
  roomName: string;
  enterTime: string;
  exitTime: string;
}

export interface MovementLog {
  timestamp: string;
  majuMundur: number; // dari camera.position.z
  naikTurun: number; // dari camera.position.y
  geserSamping: number; // dari camera.position.x
}

export interface CameraRotation {
  timestamp: string;
  rotation: { kananKiri: number; atasBawah: number };
}

export interface Task {
  taskId: string;
  taskName: string;
  status: "completed" | "failed" | "pending";
  timeSpent: number; // in seconds
}

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
  roomHistory?: RoomVisit[];
  movementLogs?: MovementLog[];
  cameraRotations?: CameraRotation[];
  tasks?: Task[];
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
