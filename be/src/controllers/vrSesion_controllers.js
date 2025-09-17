import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// --- Konstanta batasan untuk menghindari DoS / payload bloat ---
const MAX_ROTATIONS = 15000;
const MAX_INTERACTIONS = 15000;
const MAX_ROOM_HISTORY = 12000;
const MAX_TASKS = 10000;

// --- Schema Zod untuk validasi payload ---
const rotationSchema = z.object({
  timeStamp: z.string().datetime(),
  rotX: z.number().finite(),
  rotY: z.number().finite(),
});

const interactionSchema = z.object({
  id: z.string().min(1).max(500),
  type: z.enum(["scene", "hotspot"]),
  targetId: z.string().min(1).max(500).optional(),
  timestamp: z.string().datetime(),
});

const roomVisitSchema = z.object({
  roomId: z.string().min(1).max(500),
  roomName: z.string().min(1).max(500),
  enterTime: z.string().datetime(),
  exitTime: z.string().datetime(),
});

const taskSchema = z.object({
  taskId: z.string().min(1).max(500),
  taskName: z.string().min(1).max(500),
  status: z.enum(["completed", "failed", "pending"]),
  timeSpent: z
    .number()
    .int()
    .nonnegative()
    .max(24 * 60 * 60), // max 1 hari
});

const createSessionSchema = z.object({
  sessionId: z.string().min(1).max(500).optional(), // DB punya default cuid(), tapi FE boleh kirim
  userId: z.string().min(1).max(500),
  // name: z.string().min(1).max(200).optional(), // <- schema DB kamu tidak punya 'name'
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  duration: z
    .number()
    .int()
    .nonnegative()
    .max(7 * 24 * 60 * 60), // max 7 hari
  device: z.string().min(1).max(200).optional(),
  previousSessionId: z.string().min(1).max(200).optional(),
  // hotspots: z.array(z.string().min(1).max(200)).max(2000).optional(), // <- schema DB kamu tidak punya 'hotspots'

  cameraRotations: z.array(rotationSchema).max(MAX_ROTATIONS).optional(),
  interactions: z.array(interactionSchema).max(MAX_INTERACTIONS).optional(),
  roomHistory: z.array(roomVisitSchema).max(MAX_ROOM_HISTORY).optional(),
  tasks: z.array(taskSchema).max(MAX_TASKS).optional(),
});

// --- Helper auth (asumsi req.user diisi oleh auth middleware) ---
const isAdmin = (req) => req?.user?.role === "admin";
const isSelf = (req, userId) => req?.user?.id && req.user.id === userId;

// --- CREATE per Sesi ---
export const createVRSession = async (req, res) => {
  try {
    // Batasi body size di middleware app: express.json({ limit: '1mb' })
    const parsed = createSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid VR session payload",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      });
    }
    const data = parsed.data;

    // Otorisasi: admin boleh buat untuk siapa saja, user biasa hanya untuk dirinya
    if (!isAdmin(req) && !isSelf(req, data.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Pastikan user ada
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: { id: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Normalisasi & anti-tamper: hitung duration server-side
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    if (!(start < end)) {
      return res
        .status(400)
        .json({ message: "startTime must be before endTime" });
    }
    const serverDuration = Math.max(0, Math.round((end - start) / 1000));

    // (Opsional) Validasi previousSessionId jika dikirim
    if (data.previousSessionId) {
      const prev = await prisma.vRSession.findUnique({
        where: { sessionId: data.previousSessionId },
        select: { sessionId: true, userId: true },
      });
      if (!prev || prev.userId !== data.userId) {
        return res.status(400).json({ message: "Invalid previousSessionId" });
      }
    }

    // Clamp data arrays (just in case FE kirim > MAX, walau sudah divalidasi)
    const rotations = (data.cameraRotations ?? []).slice(0, MAX_ROTATIONS);
    const interactions = (data.interactions ?? []).slice(0, MAX_INTERACTIONS);
    const rooms = (data.roomHistory ?? []).slice(0, MAX_ROOM_HISTORY);
    const tasks = (data.tasks ?? []).slice(0, MAX_TASKS);

    // Transaksi untuk nested create
    const session = await prisma.$transaction(async (tx) => {
      // NB: skema DB kamu TIDAK ada 'name' & 'hotspots'
      const created = await tx.vRSession.create({
        data: {
          // sessionId: data.sessionId, // boleh diaktifkan kalau mau pakai dari FE, else biarkan cuid()
          user: { connect: { id: data.userId } },
          startTime: start,
          endTime: end,
          duration: serverDuration,
          device: data.device,
          previousSessionId: data.previousSessionId,

          cameraRotations: {
            create: rotations.map((r) => ({
              timeStamp: new Date(r.timeStamp), // field di DB = timeStamp (camel-Pascal case beda)
              rotX: r.rotX,
              rotY: r.rotY,
            })),
          },
          interactions: {
            create: interactions.map((i) => ({
              type: i.type, // pastikan "hotspot" bukan "hostspot"
              targetId: i.targetId,
              timestamp: new Date(i.timestamp),
            })),
          },
          roomHistory: {
            create: rooms.map((room) => ({
              roomId: room.roomId,
              roomName: room.roomName,
              enterTime: new Date(room.enterTime),
              exitTime: new Date(room.exitTime),
            })),
          },
          tasks: {
            create: tasks.map((t) => ({
              taskId: t.taskId,
              taskName: t.taskName,
              status: t.status, // "completed" | "failed" | "pending"
              timeSpent: t.timeSpent,
            })),
          },
        },
        include: {
          tasks: true,
          interactions: true,
          roomHistory: true,
          cameraRotations: true,
        },
      });

      return created;
    });

    return res.status(201).json({ message: "VR session created", session });
  } catch (err) {
    // Jangan bocorin detail DB error
    console.error("createVRSession error:", err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// buat data real-time
// const realTimeUpdateSchema = z.object({
//   sessionId: z.string().min(1).max(500),
//   cameraRotations: z.array(rotationSchema).max(50).optional(),
//   interactions: z.array(interactionSchema).max(20).optional(),
//   roomHistory: z.array(roomVisitSchema).max(10).optional(),
// });

// --- CREATE per detik ---
// export const updateVRSessionRealtime = async (req, res) => {
//   try {
//     const parsed = realTimeUpdateSchema.safeParse(req.body);
//     if (!parsed.success) {
//       return res.status(400).json({
//         message: "Invalid realtime payload",
//         issues: parsed.error.issues.map((i) => ({
//           path: i.path.join("."),
//           message: i.message,
//         })),
//       });
//     }

//     const data = parsed.data;

//     // Pastikan session ada
//     const session = await prisma.vRSession.findUnique({
//       where: { sessionId: data.sessionId },
//       include: { user: true },
//     });
//     if (!session) return res.status(404).json({ message: "Session not found" });

//     // Authorisasi: HANYA pemilik session (user biasa) yang boleh update
//     if (session.user.id !== req.user.id) {
//       return res
//         .status(403)
//         .json({ message: "Forbidden: only session owner can update" });
//     }

//     // Append data baru per detik
//     const updated = await prisma.vRSession.update({
//       where: { sessionId: data.sessionId },
//       data: {
//         cameraRotations: {
//           create: (data.cameraRotations ?? []).map((r) => ({
//             timeStamp: new Date(r.timestamp),
//             rotX: r.rotation.x,
//             rotY: r.rotation.y,
//           })),
//         },
//         interactions: {
//           create: (data.interactions ?? []).map((i) => ({
//             type: i.type,
//             targetId: i.targetId,
//             timestamp: new Date(i.timestamp),
//           })),
//         },
//         roomHistory: {
//           create: (data.roomHistory ?? []).map((r) => ({
//             roomId: r.roomId,
//             roomName: r.roomName,
//             enterTime: new Date(r.enterTime),
//             exitTime: r.exitTime ? new Date(r.exitTime) : null,
//           })),
//         },
//       },
//     });

//     return res.status(200).json({
//       message: "Realtime data appended",
//       sessionId: data.sessionId,
//       counts: {
//         rotations: updated.cameraRotations.length,
//         interactions: updated.interactions.length,
//         rooms: updated.roomHistory.length,
//       },
//     });
//   } catch (err) {
//     console.error("updateVRSessionRealtime error:", err?.message);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// --- GET ALL (ADMIN) + pagination & filter ---
export const getAllVRSession = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ message: "Forbidden" });

    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit || "20", 10))
    );
    const skip = (page - 1) * limit;

    // Optional filters: dateFrom, dateTo, userId
    const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : null;
    const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : null;
    const userId = req.query.userId?.toString();

    const where = {
      ...(userId ? { userId } : {}),
      ...(dateFrom || dateTo
        ? {
            startTime: {
              ...(dateFrom ? { gte: dateFrom } : {}),
              ...(dateTo ? { lte: dateTo } : {}),
            },
          }
        : {}),
    };

    const [total, sessions] = await prisma.$transaction([
      prisma.vRSession.count({ where }),
      prisma.vRSession.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startTime: "desc" },
        include: {
          tasks: true,
          interactions: true,
          roomHistory: true,
          cameraRotations: true,
          user: { select: { id: true, fullName: true, email: true } },
        },
      }),
    ]);

    return res.status(200).json({
      message: "VR sessions fetched",
      meta: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      sessions,
    });
  } catch (err) {
    console.error("getAllVRSession error:", err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// --- GET BY USER (self atau admin) + pagination ---
export const getSessionByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isAdmin(req) && !isSelf(req, userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit || "20", 10))
    );
    const skip = (page - 1) * limit;

    const [total, sessions] = await prisma.$transaction([
      prisma.vRSession.count({ where: { userId } }),
      prisma.vRSession.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { startTime: "desc" },
        include: {
          tasks: true,
          interactions: true,
          roomHistory: true,
          cameraRotations: true,
        },
      }),
    ]);

    return res.status(200).json({
      message: "VR sessions fetched",
      meta: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      sessions,
    });
  } catch (err) {
    console.error("getSessionByUser error:", err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// --- GET ONE + stats aman ---
export const getOneVRSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.vRSession.findUnique({
      where: { sessionId },
      include: {
        tasks: true,
        interactions: true,
        roomHistory: true,
        cameraRotations: true,
        user: { select: { id: true, fullName: true, imgProfile: true } },
      },
    });

    if (!session)
      return res.status(404).json({ message: "VR session not found" });

    // Authorisasi: admin atau pemilik
    if (!isAdmin(req) && !isSelf(req, session.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const stats = {
      sessionId: session.sessionId,
      userId: session.userId,
      duration: session.duration,
      totalRooms: session.roomHistory.length,
      completedTasks: session.tasks.filter((t) => t.status === "completed")
        .length,
      failedTasks: session.tasks.filter((t) => t.status === "failed").length,
      hotspotsClicked: session.interactions.filter((i) => i.type === "hotspot")
        .length,
    };

    return res
      .status(200)
      .json({ message: "VR session fetched", session, stats });
  } catch (err) {
    console.error("getOneVRSession error:", err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// --- DELETE (admin saja) ---
export const deleteVRSession = async (req, res) => {
  try {
    if (!isAdmin(req)) return res.status(403).json({ message: "Forbidden" });

    const { sessionId: id } = req.params;
    const deleted = await prisma.vRSession.delete({
      where: { sessionId: id },
      include: {
        tasks: true,
        interactions: true,
        roomHistory: true,
        cameraRotations: true,
      },
    });

    // Relasi kamu sudah ON DELETE CASCADE, jadi child ikut terhapus.
    return res
      .status(200)
      .json({ message: "VR session deleted", deletedId: deleted.sessionId });
  } catch (err) {
    // Kalau not found, Prisma throw P2025
    if (err?.code === "P2025") {
      return res.status(404).json({ message: "VR session not found" });
    }
    console.error("deleteVRSession error:", err?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
