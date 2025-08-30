import express from "express";
import {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
} from "../controllers/auth_controllers.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
router.post("/logout", logoutAdmin);

export default router;
