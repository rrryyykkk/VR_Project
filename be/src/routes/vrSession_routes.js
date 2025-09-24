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

router.post("/", authMiddleware("user"), createVRSession); // FE -> BE
router.get("/", authMiddleware("admin"), adminMiddleware, getAllVRSession); // admin session global
router.get("/user/:userId", authMiddleware("user"), getSessionByUser); // user session
router.get("/:sessionId/stats", authMiddleware("user"), getOneVRSession); // stats per-sesion
router.delete(
  "/:sessionId",
  authMiddleware("admin"),
  adminMiddleware,
  deleteVRSession
); // admin delete ("id")

export default router;
