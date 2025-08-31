import express from "express";
import {
  createVRSession,
  getAllVRSession,
  getOneVRSession,
  getSessionByUser,
} from "../controllers/vrSesion_controllers";
import { adminMiddleware, authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.post("/", createVRSession); // FE -> BE
router.get("/", authMiddleware, adminMiddleware, getAllVRSession); // admin session global
router.get("/user/:userId", authMiddleware, getSessionByUser); // user session
router.get("/:sesionId/stats", authMiddleware, getOneVRSession); // stats per-sesion

export default router;
