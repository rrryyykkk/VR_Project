import express from "express";
import { loginUser, logoutUser } from "../controllers/auth_controllers.js";
import { authMiddleware } from "../middlewares/auth.js";
import { rateLimiter } from "../middlewares/rate_limiter.js";

const router = express.Router();

router.post("/login", rateLimiter, loginUser);
router.post("/logout", rateLimiter, authMiddleware, logoutUser);

export default router;
