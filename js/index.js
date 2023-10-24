// Game constants and variables
const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");
const musicSound = new Audio("music/music.mp3");

let board = document.getElementById("board");
let inputDir = { x: 0, y: 0 };
let isGameStart = false;
let keyCheck = null;
let speed = 5;
let lastPaintTime = 0;
let snakeArr = [];
let food = { x: 6, y: 5 };
let initialRender = false;
let gameStop = false;
let isDirection = true;
let snakeElement = null;
//This function initializes the snake with a length of 5 and positions it at coordinates x: 10 and y: 23.
function snakeInitialLenFive() {
  for (let i = 1; i <= 5; i++) {
    snakeArr.push({ x: 10 - i, y: 23 });
  }
}
snakeInitialLenFive();

function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  if (!gameStop) {
    gameEngine();
  }
}

function isCollide(snake) {
  //The snake collides with itself.
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  //If the snake hit into the wall
  if (
    snake[0].x >= 25 ||
    snake[0].x <= 0 ||
    snake[0].y >= 25 ||
    snake[0].y <= 0
  ) {
    return true;
  }

  return false;
}

function gameEngine() {
  // Updating snake array and food
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };
    gameStop = true;
    // Use SweetAlert2 for the game over message
    Swal.fire({
      title: "Game Over",
      text: "Press any key to play again!",
      icon: "error",
      confirmButtonText: "OK",
    }).then((result) => {
      // Reload the page when the user clicks 'OK'
      if (result.isConfirmed) {
        location.reload();
      }
    });

    snakeArr = [];
    snakeInitialLenFive();
    musicSound.play();
  }

  // When the snake has consumed food, the score is incremented, and a new piece of food is generated.
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    // Increase the length of the snake
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });

    // This code generates new food at a random position within the game board.
    let a = 2;
    let b = 22;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }

  // Moving the snake one step
  if (isGameStart) {
    for (let i = snakeArr.length - 2; i >= 0; i--) {
      snakeArr[i + 1] = { ...snakeArr[i] };
    }
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // Render the snake
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    snakeElement.classList.add("head");
    board.appendChild(snakeElement);
  });

  // Display the food
  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// Main logic starts here
window.requestAnimationFrame(main);

window.addEventListener("keydown", (e) => {
  // This logic ensures that if you press the left arrow key, you cannot immediately press the right arrow key, and if you press the up arrow key, you cannot immediately press the down arrow key.
  if (
    (keyCheck == "ArrowUp" && e.key == "ArrowDown") ||
    (keyCheck == "ArrowDown" && e.key == "ArrowUp") ||
    (keyCheck == "ArrowRight" && e.key == "ArrowLeft") ||
    (keyCheck == "ArrowLeft" && e.key == "ArrowRight")
  ) {
    return;
  }
  keyCheck = e.key;
  isGameStart = true;
  inputDir = { x: 0, y: 1 };
  //The initial direction of the snake will be upwards when any key is pressed.
  if (isDirection) {
    inputDir.x = 0;
    inputDir.y = -1;
    isDirection = false;
    return;
  }
  //This switch case will control the movement of the snake in accordance with the arrow keys
  switch (e.key) {
    case "ArrowUp":
      inputDir.x = 0;
      inputDir.y = -1;
      break;
    case "ArrowDown":
      inputDir.x = 0;
      inputDir.y = 1;
      break;
    case "ArrowLeft":
      inputDir.x = -1;
      inputDir.y = 0;
      break;
    case "ArrowRight":
      inputDir.x = 1;
      inputDir.y = 0;
      break;
  }
});
