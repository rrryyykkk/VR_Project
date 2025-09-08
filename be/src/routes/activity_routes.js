import express from "express";
import { isActiveVr } from "../controllers/activity_controllers.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/isActive", authMiddleware, isActiveVr);

export default router;
