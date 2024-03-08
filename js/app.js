"use strict";

const board = document.getElementById("grid");
const scoreBoard = document.querySelector(".current_score");
const highScore = document.querySelector(".high_score");
const gameOverBoard = document.querySelector(".game_over_board");
const gameOverText = document.querySelector(".gameOverInfo h2");
const gameOverInfo = document.querySelector(".gameOverInfo");
const game_over = new Audio("./audio/game_over.mp3");
const snake_eating = new Audio("./audio/snake_eating.mp3");
const arrowButtons = document.querySelectorAll(".arrowBtns");
const rangeSpeed = document.getElementById("vol");
const playBtn = document.getElementById("play_btn");
const view_speed = document.getElementById("view_speed");
const speed_controller = document.getElementById("speed_controller");

let currentSnake = [2, 1, 0];
let direction = 1;
let width = 30;
let speed = 4;
let foodIndex = 0;
let score = 0;
let speedValue = 2;
let interval;

for (let i = 0; i < 900; i++) {
  let cell = document.createElement("div");
  cell.classList.add("single_grid");
  board.appendChild(cell);
}

const cells = document.querySelectorAll("#grid .single_grid");
cells[currentSnake[0]].classList.add("head");

for (let i = 0; i < currentSnake.length; i++) {
  cells[currentSnake[i]].classList.add("snake");
}

function gameLoop() {
  let is_hits_border_or_body = chekForHits();

  if (is_hits_border_or_body) {
    gameOver();
  } else {
    moveSnake();
  }
}
window.addEventListener("DOMContentLoaded", moveSnakeByKey);

function moveSnakeByKey() {
  rangeSpeed.value = 2;
  highScore.innerHTML = `High score:  ${localStorage.getItem("score")}`;
  window.addEventListener("keydown", function (keys) {
    changeDirection(keys.key);
  });
}

function moveSnake() {
  let tail = currentSnake.pop();
  cells[tail].classList.remove("snake");
  currentSnake.unshift(currentSnake[0] + direction);
  cells[currentSnake[1]].classList.remove("head");
  cells[currentSnake[0]].classList.add("snake", "head");
  eatFood(tail);
}

function gameOver() {
  let highScoreValue = parseInt(localStorage.getItem("score")) || 0;
  if (score > highScoreValue) {
    localStorage.setItem("score", score);
    highScore.innerHTML = `High score:  ${score}`;
  }
  game_over.play();
  clearInterval(interval);
  pushGameOverBox();
}

function pushGameOverBox() {
  gameOverBoard.style.display = "flex";
  speed_controller.style.display = 'none';
  gameOverInfo.style.display = 'flex';
  setTimeout(() => {
    gameOverText.style.transform = "scale(1.2)";
  }, 100);
}

function eatFood(tail) {
  if (currentSnake[0] == foodIndex) {
    cells[foodIndex].classList.remove("food");
    cells[foodIndex].innerHTML = '';
    snake_eating.play();
    placeFood();
    increaseSnake(tail);
  }
}

function increaseSnake(tail) {
  currentSnake.push(tail);
  cells[tail].classList.remove("food");
  countScore();
}

function countScore() {
  score += 5;
  scoreBoard.innerHTML = `Score: ${score}`;
}

placeFood();

function placeFood() {
  let randomFood = makeRandomFood();

  while (currentSnake.includes(randomFood)) {
    randomFood = makeRandomFood();
  }

  cells[randomFood].classList.add("food");
  cells[randomFood].innerHTML = '&#127813';
  foodIndex = randomFood;
}

function makeRandomFood() {
  let randomNumber = Math.floor(Math.random() * 900) + 0;
  return randomNumber;
}

function chekForHits() {
  const snakeArrayDuplicate = [...currentSnake];
  const head = snakeArrayDuplicate.shift();

  // Check if the head hits the border
  if (
    (direction === 1 && currentSnake[0] % 30 === 30 - 1) ||
    (direction === -1 && currentSnake[0] % 30 === 0) ||
    (direction === -30 && currentSnake[0] - 30 < 0) ||
    (direction === 30 && currentSnake[0] + 30 >= 30 * 30) ||
    snakeArrayDuplicate.includes(head)
  ) {
    return true;
  } else {
    return false;
  }
}

arrowButtons.forEach(function (btns) {
  btns.addEventListener("click", function () {
    changeDirection(btns.classList[0]);
  });
});

function changeDirection(key) {
  switch (key) {
    case "ArrowRight":
      direction = direction != -1 ? 1 : -1;
      break;
    case "ArrowLeft":
      direction = direction != 1 ? -1 : 1;
      break;
    case "ArrowUp":
      direction = direction != 30 ? -30 : 30;
      break;
    case "ArrowDown":
      direction = direction != -30 ? 30 : -30;
      break;
  }
}

rangeSpeed.addEventListener('input',function(){
  speedValue = rangeSpeed.value;
  view_speed.innerHTML = 'Set Speed:' + ' ' + speedValue;
})

playBtn.addEventListener('click', function(){
  speed = speedValue;
  gameOverBoard.style.display = 'none';
  interval = setInterval(gameLoop, speed * 50);

})

