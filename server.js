const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// --- DATA & STORAGE ---
let notes = [];

// Gradient Options (Tailwind classes for the card headers)
// We send these strings to the frontend to apply directly
const headerGradients = [
    'from-[#4ACDF5] to-[#BC4AF8]', // The "NGL" Blue/Purple
    'from-[#F472B6] to-[#db2777]', // Pink/Rose
    'from-[#34D399] to-[#059669]', // Green/Emerald
    'from-[#FBBF24] to-[#D97706]', // Amber/Orange
    'from-[#818CF8] to-[#4F46E5]', // Indigo/Violet
    'from-[#F87171] to-[#DC2626]', // Red
];

// Identity Generator Lists
const adjectives = ['Secret', 'Silent', 'Hidden', 'Mystery', 'Ghostly', 'Quiet', 'Masked', 'Unknown', 'Shadow'];
const animals = ['Badger', 'Fox', 'Owl', 'Squirrel', 'Panda', 'Cat', 'Wolf', 'Rabbit', 'Koala', 'Tiger'];

function generateIdentity() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const ani = animals[Math.floor(Math.random() * animals.length)];
    return `${adj} ${ani}`;
}

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send existing notes immediately so the user sees the wall
    socket.emit('init_wall', notes);

    socket.on('new_confession', (text) => {
        if (!text || text.trim() === '') return;

        // Create the Note Object
        const note = {
            id: Date.now(),
            text: text.trim(),
            // Assign visual properties server-side so everyone sees the same thing
            gradient: headerGradients[Math.floor(Math.random() * headerGradients.length)],
            identity: generateIdentity(),
            timestamp: new Date().toISOString() // We will format this on the frontend
        };

        // Add to storage
        notes.push(note);

        // FIFO: Keep only last 50
        if (notes.length > 50) {
            notes.shift();
        }

        // Broadcast to EVERYONE (including the sender)
        io.emit('update_wall', notes);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});