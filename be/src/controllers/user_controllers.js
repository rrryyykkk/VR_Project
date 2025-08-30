import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { parse } from "dotenv";

const prisma = new PrismaClient();

// ----------------- GET ALL USER -----------------
export const getAllUserByAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    const users = await prisma.user.findMany({
      where: { adminId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        age: true,
        gender: true,
        imgProfile: true,
        createdAt: true,
        educationHistory: true,
        medicalNote: true,
        isLogin: true,
        isActive: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------- Create USER By Admin -----------------
export const createUserAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    const {
      email,
      password,
      fullName,
      age,
      gender,
      educationHistory,
      medicalNote,
    } = req.body;

    if (!email || !password || !fullName)
      return res
        .status(400)
        .json({ message: "Email, password, and fullName are required" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        adminId,
        email,
        password: hashedPassword,
        fullName,
        age: age ? parseInt(age, 10) : null,
        gender,
        educationHistory,
        medicalNote,
      },
    });
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    if (error.code === "P2002")
      return res.status(409).json({ message: "Email already exists" });
    res.status(500).json({ message: "Internal server error" });
    console.log("error", error.message);
  }
};

// ----------------- EDIT USER By Admin -----------------
export const editUserAdmin = async (req, res) => {
  try {
    const { id } = req.params; // id user yang mau diupdate
    const {
      email,
      fullName,
      age,
      gender,
      educationHistory,
      medicalNote,
      oldPassword,
      newPassword,
    } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    let updatedData = {
      email,
      fullName,
      age,
      gender,
      educationHistory,
      medicalNote,
    };

    // kalau email diubah, cek duplikat
    if (email && email !== user.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    // kalau password mau diubah
    if (newPassword) {
      if (!oldPassword) {
        return res
          .status(400)
          .json({ message: "Old password is required to change password" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      updatedData.password = hashedNewPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------- DELETE USER By Admin -----------------
export const deleteUserAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;

    // Pastikan user dimiliki oleh admin ini
    const user = await prisma.user.findFirst({
      where: { id, adminId },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or not owned by this admin" });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------- UPDATE USER SENDIRI -----------------
export const updateUser = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
