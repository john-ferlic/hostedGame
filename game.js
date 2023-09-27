const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const character = {
    x: 50,
    y: 50,
    speed: 5,
};

function drawCharacter() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(character.x, character.y, 50, 50); // Draw the character
}

function update() {
    // Update game state, handle input, and perform game logic here
}

function gameLoop() {
    update();
    drawCharacter();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    // Handle key presses to move the character
    if (event.key === 'ArrowUp') character.y -= character.speed;
    if (event.key === 'ArrowDown') character.y += character.speed;
    if (event.key === 'ArrowLeft') character.x -= character.speed;
    if (event.key === 'ArrowRight') character.x += character.speed;
});

gameLoop();
