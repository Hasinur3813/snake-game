"use strict";

const board = document.getElementById("grid");
const scoreBoard = document.querySelector(".current_score");
const highScore = document.querySelector(".high_score");
const gameOverBoard = document.querySelector(".game_over_board");
const gameOverText = document.querySelector(".game_over_board h2");
const game_over = new Audio('./audio/game_over.mp3');
const snake_eating = new Audio('./audio/snake_eating.mp3');

let currentSnake = [2, 1, 0];
let direction = 1;
let width = 30;
let speed = 5;
let is_game_over = false;
let foodIndex = 0;
let score = 0;
let interval;

for (let i = 0; i < 900; i++) {
  let cell = document.createElement("div");
  cell.classList.add('single_grid');
  board.appendChild(cell);
}

const cells = document.querySelectorAll("#grid .single_grid");
cells[currentSnake[0]].classList.add("head");

for (let i = 0; i < currentSnake.length; i++) {
  cells[currentSnake[i]].classList.add("snake");
}
interval = setInterval(gameLoop, speed * 20);

function gameLoop() {
  let is_hits_border_or_body = chekForHits();

  if (is_hits_border_or_body) {
    is_game_over = true;
    gameOver();
  } else {
    is_game_over = false;
    moveSnake();
  }
}
window.addEventListener("DOMContentLoaded", moveSnakeByKey);

function moveSnakeByKey() {
  highScore.innerHTML = `High score:  ${localStorage.getItem("score")}`;

  window.addEventListener("keydown", function (keys) {
    switch (keys.key) {
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

function pushGameOverBox(){
  gameOverBoard.style.display = 'flex';
  setTimeout(()=>{
    gameOverText.style.transform = 'scale(1.2)';
  },100)

}

function eatFood(tail) {
  if (currentSnake[0] == foodIndex) {
    cells[foodIndex].classList.remove("food");
    snake_eating.play();
    placeFood();
    increaseSnake(tail);
  }
}

function increaseSnake(tail) {
  cells[tail].classList.add("food");
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
  foodIndex = randomFood;
}

function makeRandomFood() {
  let randomNumber = Math.floor(Math.random() * (900 - 0)) + 0;
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