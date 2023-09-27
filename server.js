const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const players = {};

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Assign a random starting position to the player
    players[socket.id] = {
        x: Math.random() * 800,
        y: Math.random() * 600,
    };

    // Send the player's initial position
    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', players[socket.id]);

    socket.on('playerMovement', (movementData) => {
        players[socket.id] = movementData;
        socket.broadcast.emit('playerMoved', { id: socket.id, ...movementData });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
