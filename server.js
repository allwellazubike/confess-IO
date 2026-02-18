const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

// Enable CORS for development (Vite runs on different port)
if (process.env.NODE_ENV !== "production") {
  const cors = require("cors"); // Optional: mostly for API calls, Socket.io handles its own
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    );
    next();
  });
}

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now (dev/prod)
    methods: ["GET", "POST"],
  },
});

// --- ADMIN CONFIGURATION ---
const ADMIN_PASSWORD = "admin123";

let notes = []; // Global notes for now (will move to DB later)

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

// API Routes
app.get("/api/generate-id", (req, res) => {
  // Generate a unique ID (simple random for now)
  const uniqueId = Math.random().toString(36).substring(2, 9);
  res.json({ id: uniqueId });
});

// Socket.io Events
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send existing notes to the new user
  socket.emit("init_wall", notes);

  socket.on("new_confession", (text) => {
    if (!text || text.trim() === "") return;

    const note = {
      id: Date.now(),
      text: text.trim(),
      gradient:
        headerGradients[Math.floor(Math.random() * headerGradients.length)],
      identity: generateIdentity(),
      timestamp: new Date().toISOString(),
    };

    notes.push(note);
    if (notes.length > 50) notes.shift();

    io.emit("update_wall", notes);
  });

  // Admin Events
  socket.on("admin_login", (password) => {
    if (password === ADMIN_PASSWORD) {
      socket.emit("admin_success", "Welcome, Master.");
    } else {
      socket.emit("admin_fail", "Wrong password.");
    }
  });

  socket.on("admin_delete_note", (id, password) => {
    if (password !== ADMIN_PASSWORD) return;
    notes = notes.filter((note) => note.id !== id);
    io.emit("update_wall", notes);
  });

  socket.on("admin_clear_all", (password) => {
    if (password !== ADMIN_PASSWORD) return;
    notes = [];
    io.emit("update_wall", notes);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Serve React App in Production
if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, "client/dist")));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
