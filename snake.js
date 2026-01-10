const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameRunning = false;
let gameLoop;

function drawGame() {
  ctx.fillStyle = '#f9fbfd';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#48a6f2' : '#75b6ee';
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  });

  ctx.fillStyle = '#ff6b6b';
  ctx.fillRect(
    food.x * gridSize,
    food.y * gridSize,
    gridSize - 2,
    gridSize - 2
  );
}

function moveSnake() {
  if (dx === 0 && dy === 0) return;

  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount
  ) {
    gameOver();
    return;
  }

  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;
    generateFood();
  } else {
    snake.pop();
  }
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };

  if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    generateFood();
  }
}

function gameOver() {
  gameRunning = false;
  clearInterval(gameLoop);
  restartBtn.style.display = 'inline-block';

  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  ctx.font = '30px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);

  ctx.font = '20px Inter';
  ctx.fillText(
    'Score: ' + score,
    canvas.width / 2,
    canvas.height / 2 + 40
  );
}

function startGame() {
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  score = 0;
  scoreElement.textContent = score;
  generateFood();
  gameRunning = true;
  restartBtn.style.display = 'none';

  clearInterval(gameLoop);
  gameLoop = setInterval(() => {
    moveSnake();
    drawGame();
  }, 100);
}

document.addEventListener('keydown', e => {
  // 🚫 Prevent page scrolling with arrow keys
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }

  if (!gameRunning && e.key.startsWith('Arrow')) {
    startGame();
  }

  if (e.key === 'ArrowUp' && dy === 0) {
    dx = 0;
    dy = -1;
  } else if (e.key === 'ArrowDown' && dy === 0) {
    dx = 0;
    dy = 1;
  } else if (e.key === 'ArrowLeft' && dx === 0) {
    dx = -1;
    dy = 0;
  } else if (e.key === 'ArrowRight' && dx === 0) {
    dx = 1;
    dy = 0;
  }
});

restartBtn.addEventListener('click', startGame);

// Initial draw
drawGame();
