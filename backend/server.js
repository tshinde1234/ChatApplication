const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

let messageHistory = [];

io.on("connection", (socket) => {
  console.log("User connected");

  socket.emit("chatHistory", messageHistory);

  socket.on("chatMessage", (msg) => {
    messageHistory.push(msg);
    io.emit("chatMessage", msg);
  });

  socket.on("clearHistory", () => {
    messageHistory = [];
    io.emit("chatHistory", []);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
