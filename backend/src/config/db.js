import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("[MongoDB Error] MONGODB_URI or MONGO_URI environment variable is missing!");
    throw new Error("MONGODB_URI environment variable is missing in serverless environment");
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    isConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error] Connection failed: ${error.message}`);
    throw error;
  }
};
