"use strict";
// DOM Elements
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


let currentSnake = [2, 1, 0]; // Initial position of the snake
let direction = 1; // Initial direction of the snake (1: right, -1: left, 30: down, -30: up)
let width = 30; // Width of the game board
let speed = 4; // Initial speed of the game
let foodIndex = 0; // Initial index of the food position
let score = 0; // Initial score of the game
let speedValue = 2; // Initial speed value (for UI control)
let interval; // Interval variable for the game loop


// draw the snake cells
for (let i = 0; i < 900; i++) {
  let cell = document.createElement("div");
  cell.classList.add("single_grid");
  board.appendChild(cell);
}

// access the cells and add the head
const cells = document.querySelectorAll("#grid .single_grid");
cells[currentSnake[0]].classList.add("head");

// draw the snake
for (let i = 0; i < currentSnake.length; i++) {
  cells[currentSnake[i]].classList.add("snake");
}

// This function runs the game loop, checking for hits and moving the snake accordingly
function gameLoop() {
  let is_hits_border_or_body = chekForHits(); // Check if the snake hits the border or itself

  if (is_hits_border_or_body) {
    // If the snake hits, end the game
    gameOver();
  } else {
    // Otherwise, move the snake
    moveSnake();
  }
}

// This function sets up event listeners for keyboard input to control the snake's movement
window.addEventListener("DOMContentLoaded", moveSnakeByKey);

// This function sets the initial speed and high score display, and listens for key presses to change the snake's direction
function moveSnakeByKey() {
  rangeSpeed.value = 2; // Set initial speed
  highScore.innerHTML = `High score:  ${localStorage.getItem("score")}`; // Display high score
  window.addEventListener("keydown", function (keys) {
    changeDirection(keys.key); // Change snake direction based on key press
  });
}

// This function moves the snake on the game board
function moveSnake() {
  let tail = currentSnake.pop(); // Remove the tail of the snake
  cells[tail].classList.remove("snake"); // Remove tail from the board
  currentSnake.unshift(currentSnake[0] + direction); // Add a new head to the snake
  cells[currentSnake[1]].classList.remove("head"); // Remove old head
  cells[currentSnake[0]].classList.add("snake", "head"); // Add new head to the board
  eatFood(tail); // Check if the snake has eaten food
}

// This function handles the game over scenario
function gameOver() {
  let highScoreValue = parseInt(localStorage.getItem("score")) || 0; // Get the high score
  if (score > highScoreValue) {
    // If the current score is higher, update the high score
    localStorage.setItem("score", score);
    highScore.innerHTML = `High score:  ${score}`;
  }
  game_over.play(); // Play game over sound
  clearInterval(interval); // Stop the game loop
  pushGameOverBox(); // Display game over message
}

// This function displays the game over message and updates UI accordingly
function pushGameOverBox() {
  gameOverBoard.style.display = "flex"; // Display game over box
  speed_controller.style.display = "none"; // Hide speed controller
  gameOverInfo.style.display = "flex"; // Display game over info
  setTimeout(() => {
    gameOverText.style.transform = "scale(1.2)"; // Animate game over text
  }, 100);
}

// This function checks if the snake has eaten the food
function eatFood(tail) {
  if (currentSnake[0] == foodIndex) {
    // If the snake's head is on the food
    cells[foodIndex].classList.remove("food"); // Remove food from the board
    cells[foodIndex].innerHTML = ""; // Clear food icon
    snake_eating.play(); // Play eating sound
    placeFood(); // Place new food on the board
    increaseSnake(tail); // Increase snake's length
  }
}

// This function increases the length of the snake after eating food
function increaseSnake(tail) {
  currentSnake.push(tail); // Add the tail back to the snake
  cells[tail].classList.remove("food"); // Remove food class from the tail cell
  countScore(); // Increase the score
}

// This function updates the score when the snake eats food
function countScore() {
  score += 5; // Increment score
  scoreBoard.innerHTML = `Score: ${score}`; // Update score display
}

// Initialize the game by placing the initial food
placeFood();

// This function places food randomly on the game board
function placeFood() {
  let randomFood = makeRandomFood(); // Generate random position for food

  // Make sure food doesn't overlap with the snake
  while (currentSnake.includes(randomFood)) {
    randomFood = makeRandomFood(); // Generate new position until it's not on the snake
  }

  cells[randomFood].classList.add("food"); // Add food class to the cell
  cells[randomFood].innerHTML = "&#127813"; // Display food icon
  foodIndex = randomFood; // Update food index
}

// This function generates a random position for the food
function makeRandomFood() {
  let randomNumber = Math.floor(Math.random() * 900) + 0; // Generate random number between 0 and 899
  return randomNumber; // Return the random number
}

// This function checks for collisions with borders or itself
function chekForHits() {
  const snakeArrayDuplicate = [...currentSnake]; // Create a copy of the snake array
  const head = snakeArrayDuplicate.shift(); // Remove the head from the array

  // Check if the head hits the borders or if it collides with itself
  if (
    (direction === 1 && currentSnake[0] % 30 === 30 - 1) || // Right border
    (direction === -1 && currentSnake[0] % 30 === 0) || // Left border
    (direction === -30 && currentSnake[0] - 30 < 0) || // Top border
    (direction === 30 && currentSnake[0] + 30 >= 30 * 30) || // Bottom border
    snakeArrayDuplicate.includes(head) // Snake collides with itself
  ) {
    return true; // If there's a hit, return true
  } else {
    return false; // Otherwise, return false
  }
}
// Event listeners for arrow buttons to change snake direction
arrowButtons.forEach(function (btns) {
  btns.addEventListener("click", function () {
    changeDirection(btns.classList[0]); // Change direction based on button clicked
  });
});

// Function to change snake direction based on keyboard input
function changeDirection(key) {
  switch (key) {
    case "ArrowRight":
      direction = direction != -1 ? 1 : -1; // Change direction to right unless already moving left
      break;
    case "ArrowLeft":
      direction = direction != 1 ? -1 : 1; // Change direction to left unless already moving right
      break;
    case "ArrowUp":
      direction = direction != 30 ? -30 : 30; // Change direction upwards unless already moving downwards
      break;
    case "ArrowDown":
      direction = direction != -30 ? 30 : -30; // Change direction downwards unless already moving upwards
      break;
  }
}

// Event listener for changing the speed using a range input
rangeSpeed.addEventListener("input", function () {
  speedValue = rangeSpeed.value; // Get the selected speed value
  view_speed.innerHTML = "Set Speed:" + " " + speedValue; // Update speed display
});

// Event listener for the play button to start the game
playBtn.addEventListener("click", function () {
  speed = speedValue; // Set the game speed
  gameOverBoard.style.display = "none"; // Hide game over board
  interval = setInterval(gameLoop, speed * 50); // Start the game loop with the selected speed
});
