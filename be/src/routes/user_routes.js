import express from "express";
import { adminMiddleware, authMiddleware } from "../middlewares/auth.js";
import {
  createUserAdmin,
  deleteUserAdmin,
  editUserAdmin,
  getAllUserByAdmin,
  updateUser,
} from "../controllers/user_controllers.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getAllUserByAdmin);
router.post("/create", authMiddleware, adminMiddleware, createUserAdmin);
router.put("/edit/:id", authMiddleware, adminMiddleware, editUserAdmin);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUserAdmin);
router.put("/update", authMiddleware, updateUser);

export default router;
