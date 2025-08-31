// middlewares/csp.middleware.js
import helmet from "helmet";

export const cspMiddleware = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
    imgSrc: [
      "'self'",
      "data:",
      "https://images.unsplash.com",
      "https://res.cloudinary.com",
      "https://media.istockphoto.com",
    ],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    connectSrc: ["'self'", "https://api.myapp.com"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
});
