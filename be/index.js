import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
// routes
import authRoutesAdmin from "./src/routes/authAdmin_routes.js";
import authRoutesUser from "./src/routes/authUser_routes.js";
import adminRoutes from "./src/routes/admin_routes.js";
import userRoutes from "./src/routes/user_routes.js";
import activityRoutes from "./src/routes/activity_routes.js";
import vrSessionRoutes from "./src/routes/vrSession_routes.js";
// Middleware
import { cspMiddleware } from "./src/middlewares/csp.js";
import { helmetMiddleware } from "./src/middlewares/helmet.js";

dotenv.config();

const PORT = process.env.PORT;
// Middleware
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(cspMiddleware);
app.use(helmetMiddleware);

// CORS
app.use(cors({ origin: "http://localhost:5317", credentials: true }));

// Routes
app.use("/api/auth/admin", authRoutesAdmin);
app.use("/api/auth/user", authRoutesUser);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/vrSession", vrSessionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});
