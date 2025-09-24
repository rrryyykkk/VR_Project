import { PrismaClient } from "@prisma/client";
import Joi from "joi";

const prisma = new PrismaClient();

// JOI Schema
const activeSchema = Joi.object({
  isActive: Joi.boolean().required(),
});

const recordSchema = Joi.object({
  isRecord: Joi.boolean().required(),
});

// helper
const updateUserStatus = async (userId, data, selectFields) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: selectFields,
  });
};

/**
 * Gabungan isActive + heartbeatActive
 */
export const activeStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log("userActive", userId);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    let updateData = { lastActive: new Date() };
    console.log("updateDataActiveAtas", updateData);

    if (req.body?.isActive !== undefined) {
      const { error, value } = activeSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return res.status(400).json({
          message: "Invalid input",
          details: error.details.map((d) => d.message),
        });
      }
      updateData.isActive = value.isActive;
    }

    const updatedUser = await updateUserStatus(userId, updateData, {
      id: true,
      email: true,
      fullName: true,
      isActive: true,
      lastActive: true,
      updatedAt: true,
    });

    console.log("updatedUserActiveBawah", updatedUser);

    res
      .status(200)
      .json({ message: "Active status updated", user: updatedUser });
  } catch (error) {
    console.error(error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Gabungan isRecord + heartbeatRecord
 */
export const recordStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log("userRecord", userId);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    let updateData = { lastRecord: new Date() };
    console.log("updateDataRecordAtas", updateData);

    if (req.body?.isRecord !== undefined) {
      const { error, value } = recordSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return res.status(400).json({
          message: "Invalid input",
          details: error.details.map((d) => d.message),
        });
      }
      updateData.isRecord = value.isRecord;
    }

    const updatedUser = await updateUserStatus(userId, updateData, {
      id: true,
      email: true,
      fullName: true,
      isRecord: true,
      lastRecord: true,
      updatedAt: true,
    });

    console.log("updatedUserRecordBawah", updatedUser);

    res
      .status(200)
      .json({ message: "Record status updated", user: updatedUser });
  } catch (error) {
    console.error(error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Admin add task for user
 */
export const addTaskForUserByAdmin = async (req, res) => {
  try {
    // cek role
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }

    const { userId, sessionId, taskName, timeSpent } = req.body;

    if (!userId || !sessionId || !taskName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { sessions: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const session = await prisma.vRSession.findUnique({ where: { sessionId } });
    if (!session || session.userId !== userId) {
      return res.status(404).json({ message: "Session not found" });
    }

    const task = await prisma.task.create({
      data: {
        taskName: taskName.trim(),
        timeSpent: timeSpent || 0,
        status: "pending",
        sessionId,
      },
    });

    res.status(201).json({ message: "Task added", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
