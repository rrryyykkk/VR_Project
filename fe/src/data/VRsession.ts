import type { VRSession } from "../type/VRdata";

// Fungsi bantu normalisasi sudut ke rentang 0–360 derajat
function normalizeDegree(angle: number): number {
  let deg = angle % 360;
  if (deg < 0) deg += 360;
  return deg;
}

export const userSessions: VRSession[] = [
  {
    sessionId: "sess-001",
    userId: "user123",
    name: "Budi Santoso",
    startTime: "2025-08-10T09:00:00Z",
    endTime: "2025-08-10T09:30:00Z",
    duration: 1800,
    device: "Oculus Quest 2",
    hotspots: ["Hotspot A", "Hotspot B"],
    roomHistory: [
      {
        roomId: "room1",
        roomName: "Lobby",
        enterTime: "2025-08-10T09:00:00Z",
        exitTime: "2025-08-10T09:10:00Z",
      },
      {
        roomId: "room2",
        roomName: "Gallery",
        enterTime: "2025-08-10T09:10:00Z",
        exitTime: "2025-08-10T09:30:00Z",
      },
    ],
    movementLogs: [
      { timestamp: "2025-08-10T09:00:05Z", cameraX: 0, cameraY: 1, cameraZ: 0 },
      { timestamp: "2025-08-10T09:05:00Z", cameraX: 2, cameraY: 1, cameraZ: 1 },
      { timestamp: "2025-08-10T09:15:00Z", cameraX: 1, cameraY: 2, cameraZ: 1 },
      { timestamp: "2025-08-10T09:25:00Z", cameraX: 3, cameraY: 3, cameraZ: 2 },
    ],
    cameraRotations: [
      {
        timestamp: "2025-08-10T09:00:05Z",
        rotation: {
          x: normalizeDegree(5),
          y: normalizeDegree(0),
          z: normalizeDegree(0),
        },
      },
      {
        timestamp: "2025-08-10T09:05:00Z",
        rotation: {
          x: normalizeDegree(10),
          y: normalizeDegree(3),
          z: normalizeDegree(1),
        },
      },
      {
        timestamp: "2025-08-10T09:15:00Z",
        rotation: {
          x: normalizeDegree(12),
          y: normalizeDegree(5),
          z: normalizeDegree(2),
        },
      },
      {
        timestamp: "2025-08-10T09:25:00Z",
        rotation: {
          x: normalizeDegree(15),
          y: normalizeDegree(7),
          z: normalizeDegree(3),
        },
      },
    ],
    tasks: [
      {
        taskId: "task1",
        taskName: "Cari kunci",
        status: "completed",
        timeSpent: 300,
      },
      {
        taskId: "task2",
        taskName: "Selesaikan teka-teki",
        status: "pending",
        timeSpent: 0,
      },
    ],
  },
  {
    sessionId: "sess-002",
    userId: "user123",
    name: "Budi Santoso",
    startTime: "2025-08-11T10:00:00Z",
    endTime: "2025-08-11T10:40:00Z",
    duration: 2400,
    device: "Oculus Quest 2",
    hotspots: ["Hotspot C", "Hotspot D"],
    roomHistory: [
      {
        roomId: "room3",
        roomName: "Ruang Konferensi",
        enterTime: "2025-08-11T10:00:00Z",
        exitTime: "2025-08-11T10:20:00Z",
      },
      {
        roomId: "room4",
        roomName: "Ruang Presentasi",
        enterTime: "2025-08-11T10:20:00Z",
        exitTime: "2025-08-11T10:40:00Z",
      },
    ],
    movementLogs: [
      { timestamp: "2025-08-11T10:01:00Z", cameraX: 1, cameraY: 1, cameraZ: 1 },
      { timestamp: "2025-08-11T10:15:00Z", cameraX: 2, cameraY: 0, cameraZ: 1 },
      { timestamp: "2025-08-11T10:35:00Z", cameraX: 1, cameraY: 2, cameraZ: 2 },
    ],
    cameraRotations: [
      {
        timestamp: "2025-08-11T10:01:00Z",
        rotation: {
          x: normalizeDegree(0),
          y: normalizeDegree(5),
          z: normalizeDegree(0),
        },
      },
      {
        timestamp: "2025-08-11T10:15:00Z",
        rotation: {
          x: normalizeDegree(3),
          y: normalizeDegree(6),
          z: normalizeDegree(1),
        },
      },
      {
        timestamp: "2025-08-11T10:35:00Z",
        rotation: {
          x: normalizeDegree(5),
          y: normalizeDegree(7),
          z: normalizeDegree(2),
        },
      },
    ],
    tasks: [
      {
        taskId: "task3",
        taskName: "Ambil dokumen",
        status: "completed",
        timeSpent: 600,
      },
    ],
  },
];

// Kalau mau tambah adminSessions tinggal seperti ini:
// ... userSessions + data lain dengan normalisasi serupa

export const adminSessions: VRSession[] = [
  ...userSessions,
  {
    sessionId: "sess-003",
    userId: "user456",
    name: "Siti Aminah",
    startTime: "2025-08-10T08:00:00Z",
    endTime: "2025-08-10T08:45:00Z",
    duration: 2700,
    device: "HTC Vive",
    hotspots: ["Hotspot A", "Hotspot D"],
    roomHistory: [
      {
        roomId: "room1",
        roomName: "Lobby",
        enterTime: "2025-08-10T08:00:00Z",
        exitTime: "2025-08-10T08:15:00Z",
      },
      {
        roomId: "room4",
        roomName: "Ruang Pameran",
        enterTime: "2025-08-10T08:15:00Z",
        exitTime: "2025-08-10T08:45:00Z",
      },
    ],
    movementLogs: [
      { timestamp: "2025-08-10T08:00:05Z", cameraX: 0, cameraY: 0, cameraZ: 0 },
      { timestamp: "2025-08-10T08:10:00Z", cameraX: 3, cameraY: 1, cameraZ: 2 },
      { timestamp: "2025-08-10T08:20:00Z", cameraX: 4, cameraY: 2, cameraZ: 3 },
    ],
    cameraRotations: [
      {
        timestamp: "2025-08-10T08:00:05Z",
        rotation: {
          x: normalizeDegree(0),
          y: normalizeDegree(0),
          z: normalizeDegree(0),
        },
      },
      {
        timestamp: "2025-08-10T08:10:00Z",
        rotation: {
          x: normalizeDegree(15),
          y: normalizeDegree(10),
          z: normalizeDegree(5),
        },
      },
      {
        timestamp: "2025-08-10T08:20:00Z",
        rotation: {
          x: normalizeDegree(20),
          y: normalizeDegree(15),
          z: normalizeDegree(10),
        },
      },
    ],
    tasks: [
      {
        taskId: "task3",
        taskName: "Kumpulkan sampel",
        status: "failed",
        timeSpent: 400,
      },
      {
        taskId: "task5",
        taskName: "Analisis data",
        status: "pending",
        timeSpent: 0,
      },
    ],
  },
];
