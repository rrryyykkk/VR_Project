import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// routes
import authRoutesAdmin from "./src/routes/authAdmin_routes.js";
import authRoutesUser from "./src/routes/authUser_routes.js";
import adminRoutes from "./src/routes/admin_routes.js";
import userRoutes from "./src/routes/user_routes.js";

dotenv.config();

const PORT = process.env.PORT;
// Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth/admin", authRoutesAdmin);
app.use("/api/auth/user", authRoutesUser);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});
