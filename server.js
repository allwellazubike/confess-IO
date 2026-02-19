const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;


if (process.env.NODE_ENV !== "production") {
  const cors = require("cors");
  app.use(cors()); 
}

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const ADMIN_PASSWORD = "admin123";

// Store boards in memory: { "board-id": [notes...] }
let boards = {};

const headerGradients = [
  "from-[#4ACDF5] to-[#BC4AF8]",
  "from-[#F472B6] to-[#db2777]",
  "from-[#34D399] to-[#059669]",
  "from-[#FBBF24] to-[#D97706]",
  "from-[#818CF8] to-[#4F46E5]",
  "from-[#F87171] to-[#DC2626]",
];

const adjectives = [
  "Secret",
  "Silent",
  "Hidden",
  "Mystery",
  "Ghostly",
  "Quiet",
  "Masked",
  "Unknown",
  "Shadow",
];
const animals = [
  "Badger",
  "Fox",
  "Owl",
  "Squirrel",
  "Panda",
  "Cat",
  "Wolf",
  "Rabbit",
  "Koala",
  "Tiger",
];

function generateIdentity() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const ani = animals[Math.floor(Math.random() * animals.length)];
  return `${adj} ${ani}`;
}

// API: Generate unique Board ID
app.get("/api/generate-id", (req, res) => {
  const uniqueId = Math.random().toString(36).substring(2, 9);
  // Initialize empty board
  if (!boards[uniqueId]) {
    boards[uniqueId] = [];
  }
  res.json({ id: uniqueId });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Client joins a specific board
  socket.on("join_board", (boardId) => {
    socket.join(boardId);
    // Send existing notes for this board only
    const boardNotes = boards[boardId] || [];
    socket.emit("init_wall", boardNotes);
  });

  socket.on("new_confession", ({ boardId, text }) => {
    if (!text || !text.trim()) return;
    if (!boardId) return;

    // Ensure board exists
    if (!boards[boardId]) boards[boardId] = [];

    const note = {
      id: Date.now(),
      text: text.trim(),
      gradient:
        headerGradients[Math.floor(Math.random() * headerGradients.length)],
      identity: generateIdentity(),
      timestamp: new Date().toISOString(),
    };

    boards[boardId].push(note);
    if (boards[boardId].length > 50) boards[boardId].shift(); // Keep last 50 per board

    // Broadcast only to this board's room
    io.to(boardId).emit("update_wall", boards[boardId]);
  });

  socket.on("disconnect", () => {
    // Standard disconnect
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
