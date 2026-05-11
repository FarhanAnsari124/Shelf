import { io } from "socket.io-client";
import { API_URL } from "./data";

const SOCKET_URL = API_URL;
export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

socket.on("connect", () => console.log("Socket connected:", socket.id));
socket.on("connect_error", (err) => console.error("Socket error:", err));
