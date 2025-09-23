import { io } from "socket.io-client";

const SERVER_URL = process.env.VITE_SERVER_URL || "http://localhost:4000";

export const socket = io(SERVER_URL, {
  transports: ['websocket'],
});
