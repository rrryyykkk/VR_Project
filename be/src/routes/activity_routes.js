import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  activeStatus,
  recordStatus,
} from "../controllers/activity_controllers.js";

const router = express.Router();

router.post("/isActive", authMiddleware("user"), activeStatus);
router.post("/isRecord", authMiddleware("user"), recordStatus);

export default router;
