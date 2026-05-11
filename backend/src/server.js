require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, "https://shelf-comm.vercel.app", "http://localhost:3000"].filter(Boolean),
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
  });
});

const startServer = async () => {
  await connectDB();
  const serverInstance = server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${PORT} busy, retrying...`);
      setTimeout(() => {
        serverInstance.close();
        startServer();
      }, 2000);
    } else {
      console.error(err);
    }
  });
};

startServer();
