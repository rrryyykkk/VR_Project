import { PrismaClient } from "@prisma/client";
import Joi from "joi";

const prisma = new PrismaClient();

// ---------------- JOI Schema ----------------
const activeSchema = Joi.object({
  isActive: Joi.boolean().required(),
});

const recordSchema = Joi.object({
  isRecord: Joi.boolean().required(),
});

// ---------------- Helper ----------------
const updateUserStatus = async (userId, data, selectFields) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: selectFields,
  });
};

// ---------------- Controllers ----------------

/**
 * Gabungan isActive + heartbeatActive
 */
export const activeStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    let updateData = { lastActive: new Date() };

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
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    let updateData = { lastRecord: new Date() };

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

    res
      .status(200)
      .json({ message: "Record status updated", user: updatedUser });
  } catch (error) {
    console.error(error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
