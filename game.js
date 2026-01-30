// Register Service Worker for smart cache management
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then((registration) => {
            console.log('✅ Service Worker registered');
            // Check for updates every hour
            setInterval(() => registration.update(), 3600000);
        })
        .catch((error) => {
            console.log('Service Worker registration failed:', error);
        });
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Variables
const gridSize = 20;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

let snake = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }];
let food = generateFood();
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let level = 1;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let gameSpeed = 100; // milliseconds

// DOM Elements
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const highScoreDisplay = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const statusDisplay = document.getElementById('status');
const mobileControls = document.querySelector('.mobile-controls');

let gameLoop;

// Initialize
highScoreDisplay.textContent = highScore;

// Event Listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetGame);

document.addEventListener('keydown', handleKeyPress);

// Mobile Controls - Button clicks
document.getElementById('upBtn').addEventListener('click', () => changeDirection(0, -1));
document.getElementById('downBtn').addEventListener('click', () => changeDirection(0, 1));
document.getElementById('leftBtn').addEventListener('click', () => changeDirection(-1, 0));
document.getElementById('rightBtn').addEventListener('click', () => changeDirection(1, 0));

// Swipe Controls
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, false);

canvas.addEventListener('touchend', (e) => {
    if (!gameRunning || gamePaused) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    const minSwipeDistance = 30;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > minSwipeDistance && direction.x === 0) {
            changeDirection(1, 0); // Right
        } else if (diffX < -minSwipeDistance && direction.x === 0) {
            changeDirection(-1, 0); // Left
        }
    } else {
        // Vertical swipe
        if (diffY > minSwipeDistance && direction.y === 0) {
            changeDirection(0, 1); // Down
        } else if (diffY < -minSwipeDistance && direction.y === 0) {
            changeDirection(0, -1); // Up
        }
    }
}, false);

// Detect mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    mobileControls.classList.add('visible');
}

function generateFood() {
    let newFood;
    let foodOnSnake = true;
    
    while (foodOnSnake) {
        newFood = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
        
        foodOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    
    return newFood;
}

function handleKeyPress(e) {
    if (!gameRunning || gamePaused) return;
    
    switch(e.key) {
        case 'ArrowUp':
            if (direction.y === 0) changeDirection(0, -1);
            e.preventDefault();
            break;
        case 'ArrowDown':
            if (direction.y === 0) changeDirection(0, 1);
            e.preventDefault();
            break;
        case 'ArrowLeft':
            if (direction.x === 0) changeDirection(-1, 0);
            e.preventDefault();
            break;
        case 'ArrowRight':
            if (direction.x === 0) changeDirection(1, 0);
            e.preventDefault();
            break;
        case ' ':
            togglePause();
            e.preventDefault();
            break;
    }
}

function changeDirection(x, y) {
    // Prevent reversing into itself
    if ((direction.x === -x && direction.y === -y) || !gameRunning || gamePaused) return;
    nextDirection = { x, y };
}

function startGame() {
    if (gameRunning && !gamePaused) return;
    
    if (!gameRunning) {
        gameRunning = true;
        snake = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }];
        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };
        score = 0;
        level = 1;
        gameSpeed = 100;
        updateDisplay();
        statusDisplay.textContent = '🎮 Game Started!';
        statusDisplay.className = 'status success';
    }
    
    gamePaused = false;
    startBtn.textContent = 'Resume';
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    statusDisplay.textContent = '▶️ Playing...';
    
    clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
}

function togglePause() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        clearInterval(gameLoop);
        pauseBtn.textContent = 'Resume';
        statusDisplay.textContent = '⏸️ Paused';
        statusDisplay.className = 'status';
    } else {
        pauseBtn.textContent = 'Pause';
        statusDisplay.textContent = '▶️ Playing...';
        gameLoop = setInterval(update, gameSpeed);
    }
}

function resetGame() {
    gameRunning = false;
    gamePaused = false;
    clearInterval(gameLoop);
    
    snake = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }];
    food = generateFood();
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    level = 1;
    gameSpeed = 100;
    
    startBtn.textContent = 'Start Game';
    startBtn.disabled = false;
    pauseBtn.textContent = 'Pause';
    pauseBtn.disabled = true;
    statusDisplay.textContent = '🫘 Ready to play?';
    statusDisplay.className = 'status';
    
    updateDisplay();
    draw();
}

function update() {
    direction = nextDirection;
    
    // Calculate new head position
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;
    
    // Check wall collision
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        endGame('💥 Wall collision!');
        return;
    }
    
    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame('💀 Self collision!');
        return;
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10 * level;
        
        // Level up every 5 foods eaten
        if ((score / (10 * level)) % 5 === 0 && score > 0) {
            level++;
            gameSpeed = Math.max(50, 100 - (level - 1) * 10);
            clearInterval(gameLoop);
            gameLoop = setInterval(update, gameSpeed);
            statusDisplay.textContent = `⬆️ Level ${level}! Speed increased!`;
            statusDisplay.className = 'status success';
        }
        
        food = generateFood();
        updateDisplay();
    } else {
        snake.pop();
    }
    
    draw();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid (optional, for better visuals)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridWidth; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= gridHeight; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
    
    // Draw food
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(
        (food.x + 0.5) * gridSize,
        (food.y + 0.5) * gridSize,
        gridSize * 0.35,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Head
            ctx.fillStyle = '#51cf66';
            ctx.shadowColor = '#51cf66';
            ctx.shadowBlur = 10;
        } else {
            // Body
            const opacity = 1 - (index / snake.length) * 0.3;
            ctx.fillStyle = `rgba(81, 207, 102, ${opacity})`;
            ctx.shadowColor = 'rgba(81, 207, 102, 0.5)';
            ctx.shadowBlur = 5;
        }
        
        ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
    });
    
    ctx.shadowColor = 'transparent';
}

function updateDisplay() {
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }
}

function endGame(message) {
    gameRunning = false;
    gamePaused = false;
    clearInterval(gameLoop);
    
    statusDisplay.textContent = message + ` Score: ${score}`;
    statusDisplay.className = 'status error';
    
    startBtn.textContent = 'Play Again';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }
}

// Initial draw
draw();
statusDisplay.textContent = '🫘 Ready to play?';
