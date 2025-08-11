// types/VRSession.ts
export interface RoomVisit {
  roomId: string;
  roomName: string;
  enterTime: string;
  exitTime: string;
}

export interface MovementLog {
  timestamp: string;
  cameraX: number;
  cameraY: number;
  cameraZ: number;
}

export interface CameraRotation {
  timestamp: string;
  rotation: { x: number; y: number; z: number };
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
