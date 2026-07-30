import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { setupChatSockets } from "./sockets/chatSocket.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB Database
  await connectDB();

  // Create HTTP & Socket.io Server
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });

  // Setup WebSocket Handlers
  setupChatSockets(io);

  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Chat Desk AI Backend running on port ${PORT}`);
    console.log(`📡 Healthcheck: http://localhost:${PORT}/api/v1/health`);
    console.log(`💬 WebSockets: ws://localhost:${PORT}/ws/chat`);
    console.log(`====================================================`);
  });
};

startServer();
