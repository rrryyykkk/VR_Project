import express from "express";
import { isActiveVr } from "../controllers/activity_controllers";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.post("/isActive", authMiddleware, isActiveVr);

export default router;
