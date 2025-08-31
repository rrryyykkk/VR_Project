// middlewares/rateLimit.middleware.js
import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 menit
  max: 10, // max 10 request per IP per window
  standardHeaders: true, // return info in RateLimit-* headers
  legacyHeaders: false, // disable X-RateLimit-* headers
  message: {
    status: 429,
    error: "Terlalu banyak percobaan, coba lagi nanti.",
  },
});
