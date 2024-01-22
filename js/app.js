'use strict';

const board = document.getElementById("grid");
const scoreBoard = document.querySelector(".current_score");
const highScore = document.querySelector(".high_score");

let currentSnake = [2,1,0];
let direction = 1;
let width = 30;
let speed = 5;
let is_game_over = false;
let foodIndex = 0;
let score = 0;
let interval;


for (let i = 0; i < 900; i++) {
  let cell = document.createElement("div");
  board.appendChild(cell);
}


const cells = document.querySelectorAll("#grid div");
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
  highScore.innerHTML = `High score:  ${localStorage.getItem('score')}`;

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


function moveSnake(){
  let tail = currentSnake.pop();
  cells[tail].classList.remove("snake");
  currentSnake.unshift(currentSnake[0] + direction);
  cells[currentSnake[1]].classList.remove("head");
  cells[currentSnake[0]].classList.add("snake", "head");

  eatFood(tail);
}


function gameOver() {
  let gameOverSound = new Audio("./audio/gameOver.m4a");
  let getting_score = localStorage.getItem('score');
  gameOverSound.play();
  clearInterval(interval);
  console.log(localStorage.getItem('score'));
  if(score > getting_score){
  highScore.innerHTML = `High score:  ${localStorage.getItem('score')}`;
  }

}

function eatFood(tail) {
  if (currentSnake[0] == foodIndex) {
    cells[foodIndex].classList.remove("food");
    placeFood();
    increaseSnake(tail);
  }
}

function increaseSnake(tail) {
  cells[tail].classList.add("food");
  currentSnake.push(tail);
  cells[tail].classList.remove("food");
  countPoint();
  
}

function countPoint(){
  score += 5;
  scoreBoard.innerHTML = `score: ${score}`;
  localStorage.setItem('score', score);
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
    (direction === 1 && currentSnake[0] % 30 === 30 - 1 ) || 
    (direction === -1 && currentSnake[0] % 30 === 0 ) || 
    (direction === -30 && currentSnake[0] - 30 < 0  ) || 
    (direction === 30 && currentSnake[0] + 30 >= 30 * 30 ) || 
    snakeArrayDuplicate.includes(head)
  ) {
    return true;
    
  }else{
    return false;
  }
}

