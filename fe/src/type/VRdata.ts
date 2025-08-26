// types/VRSession.ts
export interface RoomVisit {
  roomId: string;
  roomName: string;
  enterTime: string;
  exitTime: string;
}

export interface MovementLog {
  timestamp: string;
  position: [number, number, number];
  rotation: { x: number; y: number };
}

export interface CameraRotation {
  timestamp: string;
  rotation: { x: number; y: number };
}

export interface Task {
  taskId: string;
  taskName: string;
  status: "completed" | "failed" | "pending";
  timeSpent: number; // in seconds
}

export interface Interaction {
  id: string;
  type: "scene" | "hotspot";
  targetId?: string;
  timestamp: string;
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
  interactions?: Interaction[];
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
