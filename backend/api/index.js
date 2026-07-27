import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

export default async function handler(req, res) {
  try {
    // Ensure database connection is established
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("[Vercel Handler Error]:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: error.message || "Internal server error connecting to database.",
      },
    });
  }
}
