// Socket.io client singleton for frontend
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
  transports: ['websocket'],
});

export default socket;
