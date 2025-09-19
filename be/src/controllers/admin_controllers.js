import { PrismaClient } from "@prisma/client";
import { comparePW, hashPW } from "../utils/hashPW.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { is } from "zod/v4/locales";
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
    const { fullName, userName, email, oldPassword, newPassword, imgProfile } =
      req.body;
    console.log(req.body);
    console.log(req.file);

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
    } else if (imgProfile && imgProfile.startsWith("http")) {
      updateData.imgProfile = imgProfile;
    }

    // update userName hrs cek apakah userName itu dah dipake ap blm
    if (userName) {
      const userNameExists = await prisma.admin.findUnique({
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
        userName: true,
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

export const getDashboard = async (req, res) => {
  try {
    const isAdmin = await prisma.admin.findUnique({
      where: { id: req.user.id },
      select: { role: true },
    });
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const now = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay()); // start from Sunday

    // 1️⃣ Ambil semua session (bisa ditambah filter by date jika mau)
    const sessions = await prisma.vRSession.findMany({
      include: {
        interactions: true,
        user: true,
      },
    });

    // 2️⃣ Hitung active users (unik)
    const activeUsers = new Set(sessions.map((s) => s.userId)).size;

    // 3️⃣ Hitung average session duration
    const avgDuration =
      sessions.reduce((acc, cur) => acc + cur.duration, 0) /
      (sessions.length || 1);
    const averageSessions = Number(avgDuration.toFixed(2));

    // 4️⃣ Total XR views = total session count
    const totalXRViews = sessions.length;

    // 5️⃣ Total interactions
    const totalInteractions = sessions.reduce(
      (acc, cur) => acc + cur.interactions.length,
      0
    );

    // 6️⃣ Chart data: weekly XR Views & Interactions
    const chartData = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      const dayStr = day.toLocaleDateString("en-US", { weekday: "short" });

      const daySessions = sessions.filter(
        (s) => s.startTime.toDateString() === day.toDateString()
      );

      const dayInteractions = daySessions.reduce(
        (acc, s) => acc + s.interactions.length,
        0
      );

      return {
        name: dayStr,
        views: daySessions.length,
        interactions: dayInteractions,
      };
    });

    return res.status(200).json({
      activeUsers,
      averageSessions,
      totalXRViews,
      totalInteractions,
      chartData,
    });
  } catch (error) {
    console.error("getDashboardData error:", error?.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
