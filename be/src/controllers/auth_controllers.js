import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { hashPW, comparePW } from "../utils/hashPW.js";
import validator from "validator";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = "2h"; // bisa juga dari env

const validRoles = ["admin", "user"];

// admin

// ----------------- REGISTER ADMIN -----------------
export const registerAdmin = async (req, res) => {
  const { email, password, userName, fullName, role, imgProfile } = req.body;

  try {
    // Validasi input
    if (!email || !password || !fullName || !userName)
      return res.status(400).json({
        message: "Email, password,userName and fullName are required",
      });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });

    // Validasi role
    const finalRole = role || "admin";
    if (!validRoles.includes(finalRole))
      return res
        .status(400)
        .json({ message: `Role must be one of: ${validRoles.join(", ")}` });

    // Cek apakah email sudah ada
    const exists = await prisma.admin.findUnique({ where: { email } });
    if (exists)
      return res.status(409).json({ message: "Email already registered" });

    const userNameExists = await prisma.admin.findUnique({
      where: { userName },
    });
    if (userNameExists)
      return res.status(409).json({ message: "Username already registered" });

    // Hash password
    const hashed = await hashPW(password);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashed,
        userName,
        fullName,
        role: finalRole,
        imgProfile: imgProfile || "",
      },
    });

    const { password: _, ...adminSafe } = admin; // hapus password

    res.status(201).json({ message: "Admin registered", admin: adminSafe });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// ----------------- LOGIN ADMIN -----------------
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await comparePW(password, admin.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin.id, role: admin.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });

    // Kirim token sebagai httpOnly cookie
    res
      .cookie("tokenAdmin", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 2 * 60 * 60 * 1000, // 2 jam
      })
      .json({ message: "Admin logged in" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// ----------------- LOGOUT ADMIN -----------------
export const logoutAdmin = async (req, res) => {
  try {
    // Hapus cookie token
    res
      .cookie("tokenAdmin", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
      })
      .json({ message: "Admin logged out" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// user
// ----------------- LOGIN USER -----------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePW(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isLogin: true },
    });

    // generate token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // kirim token sebagai httpOnly cookie
    res.cookie("tokenUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 12 * 60 * 60 * 1000, // 12 jam
    });

    res.status(200).json({ message: "User logged in" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// ----------------- LOGOUT USER -----------------
export const logoutUser = async (req, res) => {
  try {
    const userId = req.user.id;
    await prisma.user.update({
      where: { id: userId },
      data: { isLogin: false, isActive: false },
    });

    // hapus cookie
    res.clearCookie("tokenUser", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
