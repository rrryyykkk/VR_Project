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
