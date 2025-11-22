const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from current directory
app.use(express.static(__dirname));

// In-memory storage for notes
let notes = [];

// Pastel colors
const colors = [
    '#FFB7B2', // Pastel Red
    '#FFDAC1', // Pastel Orange
    '#E2F0CB', // Pastel Green
    '#B5EAD7', // Pastel Mint
    '#C7CEEA'  // Pastel Purple
];

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send existing notes to the new user
    socket.emit('init_wall', notes);

    socket.on('new_confession', (text) => {
        if (!text || text.trim() === '') return;

        const note = {
            id: Date.now(), // Simple ID
            text: text.trim(),
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.floor(Math.random() * 11) - 5 // Random rotation between -5 and 5
        };

        notes.push(note);

        // Keep only the last 50 notes
        if (notes.length > 50) {
            notes.shift();
        }

        // Broadcast the updated list to ALL users
        io.emit('update_wall', notes);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
