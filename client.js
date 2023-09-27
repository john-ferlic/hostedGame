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
