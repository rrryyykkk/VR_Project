import { PrismaClient } from "@prisma/client";
import { comparePW, hashPW } from "../utils/hashPW.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import e from "express";
const prisma = new PrismaClient();

export const getMeAdmin = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        imgProfile: true,
        createdAt: true,
      },
    });

    if (!admin) return res.status(404).json({ message: "Admin not found" });
    return res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editProfileAdmin = async (req, res) => {
  try {
    const { fullName, email, oldPassword, newPassword, imgProfile } = req.body;
    console.log("req.body:", req.body);

    // ambil data dari JWT
    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
    });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    let updateData = {};

    if (fullName) updateData.fullName = fullName;

    // update imgProfile
    if (req.file) {
      const imgUrl = await uploadToCloudinary(req.file.buffer, "imgProfile");
      updateData.imgProfile = imgUrl;
    } else if (imgProfile) {
      updateData.imgProfile = imgProfile;
    }
    console.log("imgProfile:", imgProfile);

    // update email butuh oldPassword
    if (email) {
      if (!oldPassword)
        return res.status(400).json({ message: "Old password is required" });
      const valid = await comparePW(oldPassword, admin.password);
      if (!valid)
        return res.status(401).json({ message: "Invalid old password" });
      updateData.email = email;
    }

    // update password butuh oldPassword
    if (newPassword) {
      if (!oldPassword)
        return res.status(400).json({ message: "Old password is required" });
      const valid = await comparePW(oldPassword, admin.password);
      if (!valid)
        return res.status(401).json({ message: "Invalid old password" });
      updateData.password = await hashPW(newPassword);
    }

    // simpan data
    const updatedAdmin = await prisma.admin.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        imgProfile: true,
        createdAt: true,
      },
    });
    console.log("updatedAdmin:", updatedAdmin);

    return res.status(200).json({ updatedAdmin, message: "Profile updated" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
    console.log("error:", error.message);
  }
};
