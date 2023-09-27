const socket = io();

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const players = {};

socket.on('currentPlayers', (playersData) => {
    Object.keys(playersData).forEach((id) => {
        players[id] = playersData[id];
    });
});

socket.on('newPlayer', (playerData) => {
    players[playerData.id] = playerData;
});

socket.on('playerMoved', (playerData) => {
    players[playerData.id] = playerData;
});

socket.on('playerDisconnected', (id) => {
    delete players[id];
});

function movePlayer(deltaX, deltaY) {
    // Update the player's position based on touch input
    players[socket.id].x += deltaX;
    players[socket.id].y += deltaY;

    // Emit the updated player position to the server
    socket.emit('playerMovement', players[socket.id]);
}

canvas.addEventListener('touchstart', (e) => {
    // Store the initial touch position
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling on touch devices
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;

    // Calculate the change in X and Y positions
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Adjust the player's position based on touch input
    movePlayer(deltaX, deltaY);

    // Update the start position for the next touchmove event
    touchStartX = touchEndX;
    touchStartY = touchEndY;
});

document.addEventListener('keydown', (event) => {
    const speed = 5;

    if (event.key === 'ArrowUp') {
        players[socket.id].y -= speed;
    }
    if (event.key === 'ArrowDown') {
        players[socket.id].y += speed;
    }
    if (event.key === 'ArrowLeft') {
        players[socket.id].x -= speed;
    }
    if (event.key === 'ArrowRight') {
        players[socket.id].x += speed;
    }

    socket.emit('playerMovement', players[socket.id]);
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Object.keys(players).forEach((id) => {
        const player = players[id];
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y, 50, 50);
    });

    requestAnimationFrame(gameLoop);
}

gameLoop();
