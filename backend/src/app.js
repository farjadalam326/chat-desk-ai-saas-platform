import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import widgetRoutes from "./routes/widgetRoutes.js";
import knowledgeRoutes from "./routes/knowledgeRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Security & Middleware
app.use(helmet());
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API Health Check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "online",
    timestamp: new Date().toISOString(),
    service: "Chat Desk AI SaaS Platform API",
  });
});
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  }),
);

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/widget", widgetRoutes);
app.use("/api/v1/knowledge-base", knowledgeRoutes);
app.use("/api/v1/conversations", chatRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/billing", billingRoutes);
app.use("/api/v1/settings", settingsRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
