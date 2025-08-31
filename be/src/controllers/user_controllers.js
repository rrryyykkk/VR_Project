import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import validator from "validator";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { comparePW, hashPW } from "../utils/hashPW.js";

dotenv.config();

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

      const isMatch = await comparePW(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      const hashedNewPassword = await hashPW(newPassword, 12);
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
    const userId = req.user.id;
    let {
      email,
      fullName,
      age,
      gender,
      educationHistory,
      medicalNote,
      oldPassword,
      newPassword,
    } = req.body;

    // 1. Validasi dasar
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (newPassword && newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    if (age && !validator.isInt(age.toString(), { min: 1, max: 120 })) {
      return res.status(400).json({ message: "Invalid age value" });
    }

    // 2. Cari user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 3. Persiapkan data update
    let updatedData = {};

    if (email && email !== user.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return res.status(409).json({ message: "Email already exists" });
      }
      updatedData.email = validator.normalizeEmail(email);
    }

    if (fullName) updatedData.fullName = validator.escape(fullName);
    if (educationHistory)
      updatedData.educationHistory = validator.escape(educationHistory);
    if (medicalNote) updatedData.medicalNote = validator.escape(medicalNote);

    if (age) updatedData.age = parseInt(age, 10);
    if (gender) {
      if (!["lakiLaki", "perempuan"].includes(gender)) {
        return res.status(400).json({ message: "Invalid gender" });
      }
      updatedData.gender = gender;
    }

    // 4. Ubah password kalau diminta
    if (newPassword) {
      if (!oldPassword) {
        return res
          .status(400)
          .json({ message: "Old password is required to change password" });
      }

      const isMatch = await comparePW(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      const hashedNewPassword = await hashPW(newPassword, 12); // pakai cost 12
      updatedData.password = hashedNewPassword;
    }

    // 5. Upload image
    if (req.file) {
      try {
        const imageUrl = await uploadToCloudinary(req.file.buffer);
        updatedData.imgProfile = imageUrl;
      } catch (err) {
        console.error("Cloudinary error:", err);
        return res.status(400).json({ message: "Failed to upload image" });
      }
    }

    // 6. Update DB
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
      select: {
        id: true,
        email: true,
        fullName: true,
        age: true,
        gender: true,
        educationHistory: true,
        medicalNote: true,
        imgProfile: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
