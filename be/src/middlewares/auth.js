import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getMeAdmin } from "../controllers/admin_controllers.js";
import { getMeUser } from "../controllers/user_controllers.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Token required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const authCheck = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Token required" });

    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });

    if (decoded.role === "admin") {
      const admin = await getMeAdmin(decoded.id);
      if (!admin) return res.status(401).json({ message: "Admin not found" });
      return res.json({ role: admin.role, ...admin });
    }

    if (decoded.role === "user") {
      const user = await getMeUser(decoded.id);
      if (!user) return res.status(401).json({ message: "User not found" });
      return res.json({ role: user.role, ...user });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const adminMiddleware = async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
