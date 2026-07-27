import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

export default async function handler(req, res) {
  // Ensure database connection is established
  await connectDB();
  return app(req, res);
}
