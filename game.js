// Polyfill for roundRect (for older browsers)
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (Array.isArray(r)) {
            var r1 = r[0] || 0, r2 = r[1] || r[0] || 0, r3 = r[2] || r[0] || 0, r4 = r[3] || r[1] || r[0] || 0;
        } else {
            var r1 = r2 = r3 = r4 = r || 0;
        }
        this.beginPath();
        this.moveTo(x + r1, y);
        this.lineTo(x + w - r2, y);
        this.quadraticCurveTo(x + w, y, x + w, y + r2);
        this.lineTo(x + w, y + h - r3);
        this.quadraticCurveTo(x + w, y + h, x + w - r3, y + h);
        this.lineTo(x + r4, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r4);
        this.lineTo(x, y + r1);
        this.quadraticCurveTo(x, y, x + r1, y);
        this.closePath();
    };
}

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
let foodEaten = 0; // Counter for foods eaten in current level
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let gameSpeed = 100; // milliseconds

// Level configuration
const levelConfig = {
    1: { foodsToNextLevel: 5, speedMs: 100, speedMultiplier: 1, name: "Easy" },
    2: { foodsToNextLevel: 7, speedMs: 85, speedMultiplier: 1.15, name: "Normal" },
    3: { foodsToNextLevel: 8, speedMs: 70, speedMultiplier: 1.3, name: "Hard" },
    4: { foodsToNextLevel: 10, speedMs: 55, speedMultiplier: 1.5, name: "Extreme" },
    5: { foodsToNextLevel: 12, speedMs: 40, speedMultiplier: 1.8, name: "Insane" },
    6: { foodsToNextLevel: 15, speedMs: 30, speedMultiplier: 2, name: "Nightmare" }
};

// DOM Elements
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const highScoreDisplay = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const statusDisplay = document.getElementById('status');
const mobileControls = document.querySelector('.mobile-controls');
const leaderboardBtn = document.getElementById('leaderboardBtn');
const leaderboardModal = document.getElementById('leaderboardModal');
const closeLeaderboardBtn = document.getElementById('closeLeaderboard');
const playerNameInput = document.getElementById('playerName');
const setPlayerBtn = document.getElementById('setPlayerBtn');
const leaderboardList = document.getElementById('leaderboardList');
const githubTokenInput = document.getElementById('githubToken');
const setGithubTokenBtn = document.getElementById('setGithubTokenBtn');

let gameLoop;

// Leaderboard Management
const LEADERBOARD_KEY = 'pabloDevLeaderboard';
const PLAYER_NAME_KEY = 'playerNamePablo';
let currentPlayerName = localStorage.getItem(PLAYER_NAME_KEY) || 'Anónimo';

// Initialize
highScoreDisplay.textContent = highScore;

// Event Listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetGame);
leaderboardBtn.addEventListener('click', showLeaderboard);
closeLeaderboardBtn.addEventListener('click', closeLeaderboard);
setPlayerBtn.addEventListener('click', setPlayerName);
setGithubTokenBtn.addEventListener('click', setGithubToken);

document.addEventListener('keydown', handleKeyPress);

// Close modal on background click
leaderboardModal.addEventListener('click', (e) => {
    if (e.target === leaderboardModal) {
        closeLeaderboard();
    }
});

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
        foodEaten = 0;
        const config = levelConfig[1];
        gameSpeed = config.speedMs;
        updateDisplay();
        statusDisplay.textContent = `🎮 Level 1: ${config.name} - Go!`;
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
    foodEaten = 0;
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

function levelUp() {
    level++;
    foodEaten = 0;
    
    const config = levelConfig[level] || levelConfig[6];
    gameSpeed = config.speedMs;
    
    clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
    
    let levelMessage = `⬆️ LEVEL ${level}: ${config.name}! ⬆️`;
    
    // Easter egg: Special message for reaching Nightmare level
    if (level === 6) {
        levelMessage = `🌭🔥 ¡NIVEL PABLO! ¡DEVORA COMO EL MAESTRO! 🔥🌭`;
    }
    
    statusDisplay.textContent = levelMessage;
    statusDisplay.className = 'status success';
    
    // Visual feedback - show message for 2 seconds
    setTimeout(() => {
        if (gameRunning && !gamePaused) {
            statusDisplay.textContent = '▶️ Playing...';
        }
    }, 2000);
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
        const config = levelConfig[level] || levelConfig[6];
        const basePoints = 10;
        const levelBonus = level * 5;
        score += basePoints + levelBonus; // 10 + (level * 5) points per food
        foodEaten++;
        
        // Check if leveling up
        const foodsNeeded = config.foodsToNextLevel;
        if (foodEaten >= foodsNeeded && level < 6) {
            levelUp();
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
    
    // Draw food (Fried Egg 🍳)
    const eggX = (food.x + 0.5) * gridSize;
    const eggY = (food.y + 0.5) * gridSize;
    const eggSize = gridSize * 0.4;
    
    // Egg white
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffeb99';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(eggX, eggY, eggSize, eggSize * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Egg yolk
    ctx.fillStyle = '#ffeb99';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(eggX, eggY, eggSize * 0.45, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowColor = 'transparent';
    
    // Draw snake (Sausage 🌭)
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Head - Sausage head with shine
            ctx.fillStyle = '#d4451e';
            ctx.shadowColor = '#ff6b4a';
            ctx.shadowBlur = 10;
            
            // Sausage body with rounded corners
            ctx.beginPath();
            ctx.roundRect(
                segment.x * gridSize + 1,
                segment.y * gridSize + 1,
                gridSize - 2,
                gridSize - 2,
                [3, 3, 3, 3]
            );
            ctx.fill();
            
            // Shine on sausage
            ctx.fillStyle = 'rgba(255, 200, 100, 0.4)';
            ctx.beginPath();
            ctx.arc(
                segment.x * gridSize + gridSize * 0.35,
                segment.y * gridSize + gridSize * 0.35,
                gridSize * 0.2,
                0,
                Math.PI * 2
            );
            ctx.fill();
        } else {
            // Body - Sausage segments
            const opacity = 1 - (index / snake.length) * 0.4;
            ctx.fillStyle = `rgba(212, 69, 30, ${opacity})`;
            ctx.shadowColor = `rgba(255, 107, 74, ${opacity * 0.7})`;
            ctx.shadowBlur = 5;
            
            ctx.beginPath();
            ctx.roundRect(
                segment.x * gridSize + 1,
                segment.y * gridSize + 1,
                gridSize - 2,
                gridSize - 2,
                [3, 3, 3, 3]
            );
            ctx.fill();
        }
    });
    
    ctx.shadowColor = 'transparent';
}

function updateDisplay() {
    scoreDisplay.textContent = score;
    const config = levelConfig[level] || levelConfig[6];
    const foodsNeeded = config.foodsToNextLevel;
    levelDisplay.textContent = `${level} (${foodEaten}/${foodsNeeded})`;
    
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
    
    // Save to leaderboard
    saveToLeaderboard(currentPlayerName, score, level);
}

// Leaderboard Functions
function getLeaderboard() {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveToLeaderboard(playerName, score, level) {
    let leaderboard = getLeaderboard();
    
    const entry = {
        name: playerName || 'Anónimo',
        score: score,
        level: level,
        date: new Date().toLocaleString('es-ES')
    };
    
    leaderboard.push(entry);
    
    // Sort by score descending, keep top 50
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 50);
    
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    
    // Also save to global database via API
    saveToGlobalLeaderboard(entry);
}

function saveToGlobalLeaderboard(entry) {
    // Save to proxy server (which syncs to GitHub)
    saveToProxyServer(entry);
}

async function saveToProxyServer(entry) {
    const PROXY_URL = 'http://127.0.0.1:3000/api/save-score';
    
    try {
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: entry.name,
                score: entry.score,
                level: entry.level
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Score saved:', data.githubSync ? '(synced to GitHub)' : '(cached)');
            updateLeaderboardDisplay();
        } else {
            console.log('⚠️ Proxy returned error, saving locally only');
        }
    } catch (err) {
        console.log('⚠️ Proxy server not running - score saved locally only');
    }
}

async function loadFromGitHub() {
    const PROXY_URL = 'http://127.0.0.1:3000/api/scores';
    const GITHUB_URL = 'https://raw.githubusercontent.com/frijolito2024/frijolito-snake/master/db.json';
    
    try {
        // Try proxy first
        const proxyResponse = await fetch(PROXY_URL);
        if (proxyResponse.ok) {
            const data = await proxyResponse.json();
            console.log('📊 Loaded from proxy server');
            return data.scores || [];
        }
    } catch (err) {
        console.log('Proxy not available, trying GitHub directly');
    }
    
    // Fallback to GitHub
    try {
        const response = await fetch(GITHUB_URL);
        if (response.ok) {
            const data = await response.json();
            console.log('📊 Loaded from GitHub');
            return data.leaderboard || [];
        }
    } catch (err) {
        console.error('Could not load leaderboard');
        return null;
    }
}

function setPlayerName() {
    const name = playerNameInput.value.trim();
    if (name && name.length > 0) {
        currentPlayerName = name;
        localStorage.setItem(PLAYER_NAME_KEY, name);
        playerNameInput.value = '';
        updateLeaderboardDisplay();
    }
}

function setGithubToken() {
    const token = githubTokenInput.value.trim();
    if (token && token.length > 0) {
        localStorage.setItem('githubToken', token);
        githubTokenInput.value = '';
        statusDisplay.textContent = '✅ GitHub token guardado! Scores ahora se sincronizarán.';
        statusDisplay.className = 'status success';
        setTimeout(() => {
            statusDisplay.textContent = '▶️ Playing...';
        }, 2000);
    }
}

async function showLeaderboard() {
    leaderboardModal.classList.remove('hidden');
    playerNameInput.placeholder = `Tu nombre (actualmente: ${currentPlayerName})`;
    
    // Try to load from GitHub first
    const githubLeaderboard = await loadFromGitHub();
    if (githubLeaderboard && githubLeaderboard.length > 0) {
        console.log('Loaded leaderboard from GitHub');
    }
    
    updateLeaderboardDisplay();
}

function closeLeaderboard() {
    leaderboardModal.classList.add('hidden');
}

function updateLeaderboardDisplay() {
    const leaderboard = getLeaderboard();
    const medals = ['🥇', '🥈', '🥉'];
    
    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = '<div class="empty-leaderboard">Sin puntuaciones aún. ¡Sé el primero!</div>';
        return;
    }
    
    let html = '';
    leaderboard.forEach((entry, index) => {
        const rank = index + 1;
        const medal = medals[index] || `${rank}º`;
        const isCurrentPlayer = entry.name === currentPlayerName && index < 3; // Only highlight top 3 current player
        
        html += `
            <div class="leaderboard-entry ${isCurrentPlayer ? 'current-player' : ''}">
                <div class="entry-rank">${medal}</div>
                <div class="entry-info">
                    <div class="entry-name">${entry.name}</div>
                    <div class="entry-score">${entry.score} puntos • Nivel ${entry.level}</div>
                </div>
                <div class="entry-level">Lvl ${entry.level}</div>
            </div>
        `;
    });
    
    leaderboardList.innerHTML = html;
}

// Initial draw
draw();
statusDisplay.textContent = '🌭 Preparado para comer huevos?';
