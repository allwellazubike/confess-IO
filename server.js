const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 4000;

// --- ADMIN CONFIGURATION ---
// Change this to whatever password you want!
const ADMIN_PASSWORD = "admin123"; 

app.use(express.static(__dirname));

let notes = [];

const headerGradients = [
    'from-[#4ACDF5] to-[#BC4AF8]', 
    'from-[#F472B6] to-[#db2777]', 
    'from-[#34D399] to-[#059669]', 
    'from-[#FBBF24] to-[#D97706]', 
    'from-[#818CF8] to-[#4F46E5]', 
    'from-[#F87171] to-[#DC2626]', 
];

const adjectives = ['Secret', 'Silent', 'Hidden', 'Mystery', 'Ghostly', 'Quiet', 'Masked', 'Unknown', 'Shadow'];
const animals = ['Badger', 'Fox', 'Owl', 'Squirrel', 'Panda', 'Cat', 'Wolf', 'Rabbit', 'Koala', 'Tiger'];

function generateIdentity() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const ani = animals[Math.floor(Math.random() * animals.length)];
    return `${adj} ${ani}`;
}

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.emit('init_wall', notes);

    socket.on('new_confession', (text) => {
        if (!text || text.trim() === '') return;

        const note = {
            id: Date.now(), // This ID is crucial for deleting
            text: text.trim(),
            gradient: headerGradients[Math.floor(Math.random() * headerGradients.length)],
            identity: generateIdentity(),
            timestamp: new Date().toISOString()
        };

        notes.push(note);
        if (notes.length > 50) notes.shift();

        io.emit('update_wall', notes);
    });

    // --- NEW ADMIN EVENTS ---

    // 1. Handle Login
    socket.on('admin_login', (password) => {
        if (password === ADMIN_PASSWORD) {
            socket.emit('admin_success', "Welcome, Master.");
        } else {
            socket.emit('admin_fail', "Wrong password.");
        }
    });

    // 2. Delete Specific Note
    socket.on('admin_delete_note', (id, password) => {
        if (password !== ADMIN_PASSWORD) return; // Security 

        // Filter out the note with the matching ID
        notes = notes.filter(note => note.id !== id);
        
        // Update EVERYONE (Public board + Admin panel)
        io.emit('update_wall', notes);
    });

    // 3. Clear All confess
    socket.on('admin_clear_all', (password) => {
        if (password !== ADMIN_PASSWORD) return;

        notes = []; // Wipe array
        io.emit('update_wall', notes);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});