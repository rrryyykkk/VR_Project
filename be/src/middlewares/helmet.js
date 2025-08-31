// middlewares/helmet.middleware.js
import helmet from "helmet";

export const helmetMiddleware = helmet({
  contentSecurityPolicy: false, // kita override CSP manual
  crossOriginEmbedderPolicy: true,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});
