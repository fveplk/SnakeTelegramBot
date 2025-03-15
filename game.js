const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = { x: 0, y: 0 };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameSpeed = 100;
let obstacles = [];

highScoreElement.textContent = highScore;

ctx.imageSmoothingEnabled = true;

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, gameSpeed);
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || 
        snake.some(segment => segment.x === head.x && segment.y === head.y) ||
        obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)) {
        resetGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreElement.textContent = highScore;
        }
        scoreElement.textContent = score;
        placeFood();
        if (score % 5 === 0) {
            gameSpeed -= 10;
            placeObstacle();
        }
    } else {
        snake.pop();
    }
}

function draw() {
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, 200);
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(1, '#000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'lime';
    snake.forEach((segment, index) => {
        ctx.beginPath();
        ctx.roundRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize, 5);
        ctx.fill();
        if (index === 0) {
            ctx.fillStyle = 'green';
            ctx.beginPath();
            ctx.arc(segment.x * gridSize + gridSize / 2, segment.y * gridSize + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'blue';
    obstacles.forEach(obstacle => {
        ctx.beginPath();
        ctx.roundRect(obstacle.x * gridSize, obstacle.y * gridSize, gridSize, gridSize, 5);
        ctx.fill();
    });

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(10, 10, 120, 40);

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 20, 35);
    ctx.fillText('High Score: ' + highScore, 20, 60);
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    while (snake.some(segment => segment.x === food.x && segment.y === food.y) ||
           obstacles.some(obstacle => obstacle.x === food.x && obstacle.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }
}

function placeObstacle() {
    const obstacle = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    while (snake.some(segment => segment.x === obstacle.x && segment.y === obstacle.y) ||
           (obstacle.x === food.x && obstacle.y === food.y)) {
        obstacle.x = Math.floor(Math.random() * tileCount);
        obstacle.y = Math.floor(Math.random() * tileCount);
    }
    obstacles.push(obstacle);
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    scoreElement.textContent = score;
    gameSpeed = 100;
    obstacles = [];
    placeFood();
}

document.getElementById('up').addEventListener('click', () => {
    if (direction.y === 0) direction = { x: 0, y: -1 };
});
document.getElementById('down').addEventListener('click', () => {
    if (direction.y === 0) direction = { x: 0, y: 1 };
});
document.getElementById('left').addEventListener('click', () => {
    if (direction.x === 0) direction = { x: -1, y: 0 };
});
document.getElementById('right').addEventListener('click', () => {
    if (direction.x === 0) direction = { x: 1, y: 0 };
});

placeFood();
gameLoop();