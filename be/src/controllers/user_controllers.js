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
        userName: true,
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
        isRecord: true,
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
      userName,
      age,
      gender,
      educationHistory,
      medicalNote,
    } = req.body;
    console.log(req.body);

    if (!email || !password || !fullName || !userName)
      return res.status(400).json({
        message: "Email, password,userName and fullName are required",
      });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return res.status(409).json({ message: "Email already exists" });

    const userNameExists = await prisma.user.findUnique({
      where: { userName },
    });
    if (userNameExists)
      return res.status(409).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        userName,
        age: age ? parseInt(age, 10) : 0, // default 0 kalau kosong
        gender, // enum Gender: 'lakiLaki' | 'perempuan'
        educationHistory,
        medicalNote,
        admin: {
          connect: { id: adminId }, // ✅ konek ke admin yang sudah ada
        },
      },
    });
    console.log("user yg sudah dibuat", user);
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
      userName,
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
      userName,
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

    // kalau userName diubah, cek duplikat
    if (userName && userName !== user.userName) {
      const userNameExists = await prisma.user.findUnique({
        where: { userName },
      });
      if (userNameExists) {
        return res.status(409).json({ message: "Username already exists" });
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
    const { fullName, userName, email, oldPassword, newPassword, imgProfile } =
      req.body;
    console.log(req.body);

    // ambil data dari JWT
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    let updateData = {};

    // update fullName
    if (fullName) updateData.fullName = fullName;

    // update imgProfile
    if (req.file) {
      try {
        const imgUrl = await uploadToCloudinary(req.file.buffer, "imgProfile");
        updateData.imgProfile = imgUrl;
      } catch (err) {
        console.error("Cloudinary error:", err);
        return res.status(400).json({ message: "Failed to upload image" });
      }
    } else if (imgProfile && imgProfile.startsWith("http")) {
      updateData.imgProfile = imgProfile;
    }

    // update userName harus cek apakah sudah dipakai
    if (userName) {
      const userNameExists = await prisma.user.findUnique({
        where: { userName },
      });
      if (userNameExists)
        return res.status(409).json({ message: "Username already exists" });
      updateData.userName = userName;
    }

    // update email butuh oldPassword
    if (email) {
      if (!oldPassword)
        return res.status(400).json({ message: "Old password is required" });

      const valid = await comparePW(oldPassword, user.password);
      if (!valid)
        return res.status(401).json({ message: "Invalid old password" });

      updateData.email = email;
    }

    // update password butuh oldPassword
    if (newPassword) {
      if (!oldPassword)
        return res.status(400).json({ message: "Old password is required" });

      const valid = await comparePW(oldPassword, user.password);
      if (!valid)
        return res.status(401).json({ message: "Invalid old password" });

      updateData.password = await hashPW(newPassword);
    }

    // simpan data
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        userName: true,
        fullName: true,
        imgProfile: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    console.log("updatedUser", updatedUser);

    return res
      .status(200)
      .json({ updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    console.error("updateUser error:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// ----------------- GET USER SENDIRI -----------------
export const getMeUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(404).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        age: true,
        gender: true,
        imgProfile: true,
        isActive: true,
        isRecord: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
