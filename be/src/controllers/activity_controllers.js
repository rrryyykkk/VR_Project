import { PrismaClient } from "@prisma/client";
import Joi from "joi";
const prisma = new PrismaClient();

const schema = Joi.object({
  isActiveVr: Joi.boolean().required(),
});

export const isActiveVr = async (req, res) => {
  try {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Invalid input",
        details: error.details.map((d) => d.message),
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActiveVr: value.isActiveVr },
      select: {
        id: true,
        email: true,
        fullName: true,
        isActiveVr: true,
        updatedAt: true,
      },
    });

    res.status(200).json({ message: "Status VR updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addTaskForUserByAdmin = async (req, res) => {
  try {
    const { userId, sessionId, taskId, taskName, timeSpent } = req.body;

    // validasi input
    if (!userId || !sessionId || !taskId || !taskName || !timeSpent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // pastikan user ada
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { sessions: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // pastikan session milik user tersebut
    const session = await prisma.vRSession.findUnique({
      where: { sessionId },
    });

    if (!session || session.userId !== userId) {
      return res.status(404).json({ message: "Session not found" });
    }

    const task = await prisma.task.create({
      data: {
        taskId: taskId.trim(),
        taskName: taskName.trim(),
        timeSpent: timeSpent || 0,
        status: "pending",
        sessionId,
      },
    });

    return res.status(201).json({ message: "Task added", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
