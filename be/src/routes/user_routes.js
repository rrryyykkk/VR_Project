import express from "express";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.js";
import {
  createUserAdmin,
  deleteUserAdmin,
  editUserAdmin,
  getAllUserByAdmin,
} from "../controllers/user_controllers.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getAllUserByAdmin);
router.post("/create", authMiddleware, adminMiddleware, createUserAdmin);
router.put("/edit/:id", authMiddleware, adminMiddleware, editUserAdmin);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUserAdmin);

export default router;
