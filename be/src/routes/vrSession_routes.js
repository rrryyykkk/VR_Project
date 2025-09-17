import express from "express";
import {
  createVRSession,
  deleteVRSession,
  getAllVRSession,
  getOneVRSession,
  getSessionByUser,
} from "../controllers/vrSesion_controllers.js";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authMiddleware, createVRSession); // FE -> BE
router.get("/", authMiddleware, adminMiddleware, getAllVRSession); // admin session global
router.get("/user/:userId", authMiddleware, getSessionByUser); // user session
router.get("/:sessionId/stats", authMiddleware, getOneVRSession); // stats per-sesion
router.delete("/:sessionId", authMiddleware, adminMiddleware, deleteVRSession); // admin delete ("id")

export default router;
