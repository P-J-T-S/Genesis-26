import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ["http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join a room for zone-specific updates (optional)
    socket.on("subscribe:zone", (zoneId) => {
      socket.join(`zone:${zoneId}`);
      console.log(`📍 ${socket.id} subscribed to zone:${zoneId}`);
    });

    socket.on("unsubscribe:zone", (zoneId) => {
      socket.leave(`zone:${zoneId}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  console.log("⚡ Socket.io initialized");
  return io;
};

// Get io instance (for use in controllers/services)
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

// Emit helpers
export const emitZoneUpdate = (zoneData) => {
  if (io) {
    io.emit("zone:update", zoneData);
  }
};

export const emitModeChange = (mode, zones) => {
  if (io) {
    io.emit("mode:change", { mode, zones, timestamp: new Date() });
  }
};

export const emitSignal = (type, data) => {
  if (io) {
    io.emit(`signal:${type}`, { ...data, timestamp: new Date() });
    io.emit("feed:update", { type, data, timestamp: new Date() });
  }
};

export const emitToZone = (zoneId, event, data) => {
  if (io) {
    io.to(`zone:${zoneId}`).emit(event, data);
  }
};