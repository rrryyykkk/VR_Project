import express from "express";
import { loginUser, logoutUser } from "../controllers/auth_controllers.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);

export default router;
