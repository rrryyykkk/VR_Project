import express from "express";
import { loginUser, logoutUser } from "../controllers/auth_controllers.js";
import { authMiddleware } from "../middlewares/auth.js";
import { rateLimiter } from "../middlewares/rate_limiter.js";
import { getMeUser } from "../controllers/user_controllers.js";

const router = express.Router();

router.post("/login", rateLimiter, loginUser);
router.post("/logout", rateLimiter, authMiddleware("user"), logoutUser);
router.get("/getMeUser", authMiddleware("user"), getMeUser);

export default router;
