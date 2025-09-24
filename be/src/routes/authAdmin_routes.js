import express from "express";
import {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
} from "../controllers/auth_controllers.js";
import { rateLimiter } from "../middlewares/rate_limiter.js";

const router = express.Router();

router.post("/login", rateLimiter, loginAdmin);
router.post("/register", registerAdmin);
router.post("/logout", rateLimiter, logoutAdmin);

export default router;
