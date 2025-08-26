// src/data/VRsession.ts
import type { VRSession } from "../type/VRdata";

// 🔹 Hanya 1 user, tapi banyak sesi
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
    cameraRotations: [
      { timestamp: "2025-08-10T09:00:05Z", rotation: { x: 97.88, y: 78.24 } },
      { timestamp: "2025-08-10T09:05:00Z", rotation: { x: 98.12, y: 77.95 } },
      { timestamp: "2025-08-10T09:10:00Z", rotation: { x: 96.44, y: 79.12 } },
      { timestamp: "2025-08-10T09:15:00Z", rotation: { x: 99.7, y: 78.24 } },
      { timestamp: "2025-08-10T09:25:00Z", rotation: { x: 95.31, y: 77.63 } },
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
    startTime: "2025-08-11T13:00:00Z",
    endTime: "2025-08-11T13:20:00Z",
    duration: 1200,
    device: "Oculus Quest 2",
    hotspots: ["Hotspot C"],
    roomHistory: [
      {
        roomId: "room3",
        roomName: "Hall Utama",
        enterTime: "2025-08-11T13:00:00Z",
        exitTime: "2025-08-11T13:20:00Z",
      },
    ],
    cameraRotations: [
      { timestamp: "2025-08-11T13:02:00Z", rotation: { x: 87.55, y: 65.21 } },
      { timestamp: "2025-08-11T13:05:00Z", rotation: { x: 88.12, y: 66.5 } },
      { timestamp: "2025-08-11T13:10:00Z", rotation: { x: 90.23, y: 67.1 } },
      { timestamp: "2025-08-11T13:15:00Z", rotation: { x: 91.44, y: 68.2 } },
    ],
    tasks: [
      {
        taskId: "task6",
        taskName: "Temukan artefak",
        status: "completed",
        timeSpent: 600,
      },
    ],
  },
];

// 🔹 Admin bisa lihat semua user & banyak sesi
export const adminSessions: VRSession[] = [
  ...userSessions, // user123 (Budi)
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
    cameraRotations: [
      { timestamp: "2025-08-10T08:05:00Z", rotation: { x: 95.12, y: 75.0 } },
      { timestamp: "2025-08-10T08:10:00Z", rotation: { x: 96.33, y: 76.15 } },
      { timestamp: "2025-08-10T08:20:00Z", rotation: { x: 100.21, y: 77.52 } },
      { timestamp: "2025-08-10T08:30:00Z", rotation: { x: 92.44, y: 80.3 } },
      { timestamp: "2025-08-10T08:40:00Z", rotation: { x: 93.71, y: 79.22 } },
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
  {
    sessionId: "sess-004",
    userId: "user789",
    name: "Agus Pratama",
    startTime: "2025-08-14T17:00:00Z",
    endTime: "2025-08-14T17:40:00Z",
    duration: 2400,
    device: "Oculus Rift S",
    hotspots: ["Hotspot G"],
    roomHistory: [
      {
        roomId: "room7",
        roomName: "Koridor",
        enterTime: "2025-08-14T17:00:00Z",
        exitTime: "2025-08-14T17:40:00Z",
      },
    ],
    cameraRotations: [
      { timestamp: "2025-08-14T17:05:00Z", rotation: { x: 85.55, y: 68.2 } },
      { timestamp: "2025-08-14T17:10:00Z", rotation: { x: 86.7, y: 70.33 } },
      { timestamp: "2025-08-14T17:20:00Z", rotation: { x: 88.7, y: 72.1 } },
      { timestamp: "2025-08-14T17:30:00Z", rotation: { x: 90.15, y: 73.0 } },
      { timestamp: "2025-08-14T17:35:00Z", rotation: { x: 91.05, y: 74.25 } },
    ],
    tasks: [
      {
        taskId: "task10",
        taskName: "Lakukan scanning",
        status: "completed",
        timeSpent: 600,
      },
      {
        taskId: "task11",
        taskName: "Laporkan hasil",
        status: "pending",
        timeSpent: 0,
      },
    ],
  },
];
