import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import connectDB from './database/connect.js';
import { app } from './app.js';
import { initSocket } from './socket/socket.js';

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  // Create HTTP server
  const server = createServer(app);
  
  // Initialize Socket.io
  initSocket(server);
  
  server.listen(PORT, () => {
    console.log(`🚀 Server running at PORT: ${PORT}`);
  });
});