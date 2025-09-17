import express from "express";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.js";
import {
  editProfileAdmin,
  getDashboard,
  getMeAdmin,
} from "../controllers/admin_controllers.js";
import { upload } from "../utils/multer.js";
import { rateLimiter } from "../middlewares/rate_limiter.js";

const router = express.Router();

router.get(
  "/getMeAdmin",
  rateLimiter,
  authMiddleware,
  adminMiddleware,
  getMeAdmin
);
router.put(
  "/updateAdmin",
  rateLimiter,
  authMiddleware,
  adminMiddleware,
  upload.single("imgProfile"),
  editProfileAdmin
);
router.get("/dashbord", authMiddleware, adminMiddleware, getDashboard);
export default router;
