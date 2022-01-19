
const localStorage = window.localStorage;
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const grid = 30;
let bestScore = document.querySelector("#bestScore");
const directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
};
const backwards = {
  left: "right",
  right: "left",
  up: "down",
  down: "up",
};
const restart = document.querySelector("#restart");
const snakeColorPicker = document.querySelector("#snakeColor");
const appleColorPicker = document.querySelector("#appleColor");
const speedPicker = document.querySelector("#speed");
const speeds = [70, 60, 50, 40, 30, 20];
let score = 0;
let appleColor = "red";
let snakeColor = "green";
let snakeSpeed = speeds[speedPicker.value];
let cellSize = 20;
ctx.translate(-cellSize, -cellSize);
let snake = [
  {
    x: 13,
    y: 15,
  },
  {
    x: 12,
    y: 15,
  },
  {
    x: 11,
    y: 15,
  },
  {
    x: 10,
    y: 15,
  },
];
const apple = {
  x: null,
  y: null,
};
let currDirection = "right";
let interval = null;
let startPosition = {
  x: null,
  y: null,
};
let endPosition = {
  x: null,
  y: null,
};
function move(direction) {
  let x = 0;
  let y = 0;
  switch (direction) {
    case "right":
      x = 1;
      break;
    case "left":
      x = -1;
      break;
    case "up":
      y = -1;
      break;
    case "down":
      y = 1;
      break;
  }
  const newHead = { x: snake[0].x + x, y: snake[0].y + y };
  if (newHead.x > 30) newHead.x = 1;
  if (newHead.y > 30) newHead.y = 1;
  if (newHead.x < 1) newHead.x = 30;
  if (newHead.y < 1) newHead.y = 30;
  snake.unshift(newHead);
  clearCanvas();
  if (newHead.x !== apple.x || newHead.y !== apple.y) {
    snake.pop();
  } else {
    score += 1;
    randomApple();
  }
  collision();
  snake.forEach((cell) => {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = "black";
    ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
    ctx.strokeRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
    ctx.fillStyle = appleColor;
    ctx.fillRect(apple.x * cellSize, apple.y * cellSize, cellSize, cellSize);
  });
}
function autoMove(direction) {
  clearInterval(interval);
  if (direction !== "stop") {
    currDirection = direction;
    interval = setInterval(() => {
      move(direction);
    }, snakeSpeed);
  }
}
function randomApple() {
  apple.x = Math.floor(Math.random() * 20) + 1;
  apple.y = Math.floor(Math.random() * 20) + 1;
}
function clearCanvas() {
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  ctx.fillRect(0, 0, canvas.width + 20, canvas.height + 20);
  ctx.strokeRect(0, 0, canvas.width + 20, canvas.height + 20);
}
function changeDirection(event) {
  const newDirection = directions[event.keyCode];
  if (
    currDirection !== backwards[newDirection] &&
    newDirection !== currDirection
  ) {
    autoMove(newDirection);
  }
}
function collision() {
  for (let i = 3; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      autoMove("stop");
      window.removeEventListener("keydown", changeDirection);
      document.removeEventListener("touchstart", start, false);
      document.removeEventListener("touchend", end, false);
      if (score > localStorage.getItem("BestScore")) {
        localStorage.setItem("BestScore", score);
      }
      return true;
    }
  }
  return false;
}
function startGame() {
  if(score>localStorage.getItem("BestScore")) {
    localStorage.setItem("BestScore") = score
  }
  bestScore.textContent = localStorage.getItem("BestScore");
  score = 0
  window.addEventListener("keydown", changeDirection);
  document.addEventListener("touchstart", start, false);
  document.addEventListener("touchend", end, false);
  snake = [
    {
      x: 13,
      y: 15,
    },
    {
      x: 12,
      y: 15,
    },
    {
      x: 11,
      y: 15,
    },
    {
      x: 10,
      y: 15,
    },
  ];
  randomApple();
  autoMove("left");
}
function start(event) {
  startPosition.x = event.touches[0].clientX;
  startPosition.y = event.touches[0].clientY;
}

function end(event) {
  endPosition.x = event.changedTouches[0].clientX;
  endPosition.y = event.changedTouches[0].clientY;
  const xDifference = startPosition.x - endPosition.x;
  const yDifference = startPosition.y - endPosition.y;
  let direction 
  if (Math.abs(xDifference) > Math.abs(yDifference)) {
    if (xDifference < 0) {
      direction = "right"
      turn(direction)
    } else {
      direction = "left"
      turn(direction)
    }
  } else {
    if (yDifference < 0) {
      direction = "down"
      turn(direction)
    } else {
      direction = "up"
      turn(direction)
    }
  }
  function turn(direction) {
    if(direction !== backwards[currDirection] && direction !== currDirection){
      autoMove(direction)
    }
  }
}

restart.addEventListener("click", () => startGame());
snakeColorPicker.addEventListener("change", () => {
  snakeColor = snakeColorPicker.value;
});
appleColorPicker.addEventListener("change", () => {
  appleColor = appleColorPicker.value;
});
speedPicker.addEventListener("change", () => {
  console.log(speedPicker.value);
  snakeSpeed = speeds[speedPicker.value];
});
startGame();
