import express from "express";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.js";
import {
  editProfileAdmin,
  getMeAdmin,
} from "../controllers/admin_controllers.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.get("/getMeAdmin", authMiddleware, adminMiddleware, getMeAdmin);
router.put(
  "/updateAdmin",
  authMiddleware,
  adminMiddleware,
  upload,
  editProfileAdmin
);

export default router;
