const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockHeight = 50;
const blockWidth = 50;

let highscore = Number(localStorage.getItem("highscore")) || 0;
let score = 0;
let time = `00-00`;

highScoreElement.innerText = highscore;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timerIntervalId = null;

let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
};

const blocks = [];
let snake = [
    { x: 1, y: 3 }
];

let direction = 'right';

// CREATE BOARD
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

function render() {
    let head = null;

    // Show food
    blocks[`${food.x}-${food.y}`].classList.add("food");

    // Movement logic
    if (direction == "left") head = { x: snake[0].x, y: snake[0].y - 1 };
    if (direction == "right") head = { x: snake[0].x, y: snake[0].y + 1 };
    if (direction == "up") head = { x: snake[0].x - 1, y: snake[0].y };
    if (direction == "down") head = { x: snake[0].x + 1, y: snake[0].y };

    // WALL COLLISION
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        gameOver();
        return;
    }

    // SELF COLLISION
    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        gameOver();
        return;
    }

    // FOOD EAT LOGIC
    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        snake.unshift(head);

        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };

        blocks[`${food.x}-${food.y}`].classList.add("food");

        score += 10;
        scoreElement.innerText = score;

        if (score > highscore) {
            highscore = score;
            localStorage.setItem("highscore", highscore.toString());
        }
        return;
    }

    // NORMAL MOVE
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    });

    snake.unshift(head);
    snake.pop();

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });
}

// GAME OVER
function gameOver() {
    clearInterval(intervalId);
    clearInterval(timerIntervalId);

    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
}

// START GAME
startButton.addEventListener("click", () => {
    modal.style.display = "none";
    startGame();
});

// RESTART GAME
restartButton.addEventListener("click", restartGame);

function startGame() {
    intervalId = setInterval(render, 300);
    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number);
        sec++;
        if (sec === 60) {
            sec = 0;
            min++;
        }
        time = `${String(min).padStart(2, "0")}-${String(sec).padStart(2, "0")}`;
        timeElement.innerText = time;
    }, 1000);
}

function restartGame() {
    clearInterval(intervalId);
    clearInterval(timerIntervalId);

    // Clear board
    snake.forEach(seg => {
        blocks[`${seg.x}-${seg.y}`].classList.remove("fill");
    });
    blocks[`${food.x}-${food.y}`].classList.remove("food");

    // Reset values
    score = 0;
    time = `00-00`;
    scoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.innerText = highscore;

    // Reset snake
    snake = [
        { x: 1, y: 3 }
    ];
    direction = "right";

    // New food
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };

    modal.style.display = "none";
    startGame();
}

// KEYBOARD
addEventListener('keydown', (event) => {
    if (event.key === "ArrowUp" && direction !== "down") direction = "up";
    if (event.key === "ArrowRight" && direction !== "left") direction = "right";
    if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
    if (event.key === "ArrowDown" && direction !== "up") direction = "down";
});
