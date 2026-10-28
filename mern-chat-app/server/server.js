
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app);

const allowedOrigin =
  process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "10kb" }));

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join_conversation", (conversationId) => {
    if (
      typeof conversationId === "string" &&
      /^[0-9a-fA-F]{24}$/.test(conversationId)
    ) {
      socket.join(`conversation:${conversationId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.json({ message: "ChatSpace API is running." });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "API route not found." });
});

const startServer = async () => {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error("MONGO_URI and JWT_SECRET must be configured.");
  }

  await connectDB();

  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
