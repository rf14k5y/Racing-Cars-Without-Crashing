// --- Element References ---
const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");
const gameOverScreen = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");
const restartBtnGameOver = document.getElementById("restart-btn-gameover");
const crashSound = document.getElementById("crash-sound");
const levelupSound = document.getElementById("levelup-sound");

const menuBtn = document.getElementById("menu-btn");
const pauseMenu = document.getElementById("pause-menu");
const resumeBtn = document.getElementById("resume-btn");
const homeBtn = document.getElementById("home-btn");

// --- Game State ---
const lanes = [60, 135, 215, 290];
let currentLaneIndex = 1;
let score = 0;
let level = 1;
let enemiesPassed = 0;
let speed = 2;
let backgroundSpeed = 3;
let backgroundY = 0;
let isGameOver = false;
let isPaused = false;
let highScore = localStorage.getItem("racingHighScore") || 0;

highScoreDisplay.textContent = `High Score: ${highScore}`;
player.style.left = `${lanes[currentLaneIndex]}px`;

document.addEventListener("keydown", (e) => {
  if (isGameOver && e.key === "Enter") {
    window.location.reload();
    return;
  }

  if (isGameOver || isPaused) return;

  if (e.key === "ArrowLeft" && currentLaneIndex > 0) {
    currentLaneIndex--;
  } else if (e.key === "ArrowRight" && currentLaneIndex < lanes.length - 1) {
    currentLaneIndex++;
  }
  player.style.left = `${lanes[currentLaneIndex]}px`;
});

// --- Game Mechanics ---
function isCollide(a, b) {
  return !(
    a.offsetTop + a.offsetHeight < b.offsetTop ||
    a.offsetTop > b.offsetTop + b.offsetHeight ||
    a.offsetLeft + a.offsetWidth < b.offsetLeft ||
    a.offsetLeft > b.offsetLeft + b.offsetWidth
  );
}

function createEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  const laneIndex = Math.floor(Math.random() * lanes.length);
  enemy.style.left = `${lanes[laneIndex]}px`;
  enemy.style.top = "0px";
  game.appendChild(enemy);
  return enemy;
}

function showLevel(level) {
  const banner = document.createElement("div");
  banner.className = "level-banner";
  banner.innerHTML = `<span>LEVEL ${level}</span>`;
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 2500);
}

function gameLoop() {
  if (isGameOver || isPaused) return;

  backgroundY += backgroundSpeed;
  game.style.backgroundPosition = `0 ${backgroundY}px`;

  const enemies = document.querySelectorAll(".enemy");
  enemies.forEach((enemy) => {
    let top = parseFloat(enemy.style.top || "0");
    top += speed;
    enemy.style.top = `${top}px`;

    const enemyPassed = enemy.getAttribute("data-passed");
    if (!enemyPassed && top > player.offsetTop + player.offsetHeight) {
      enemy.setAttribute("data-passed", "true");
      score++;
      enemiesPassed++;
      scoreDisplay.textContent = `Score: ${score}`;

      if (enemiesPassed % 10 === 0) {
        level++;
        speed += 0.5;
        backgroundSpeed += 0.2;
        showLevel(level);
        levelupSound.currentTime = 0;
        levelupSound.play();
      }
    }

    if (top > 600) enemy.remove();
    if (isCollide(enemy, player)) endGame();
  });

  requestAnimationFrame(gameLoop);
}

function endGame() {
  isGameOver = true;
  pauseMenu.style.display = "none";
  gameOverScreen.style.display = "flex";
  crashSound.currentTime = 0;
  crashSound.play();

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("racingHighScore", highScore);
  }

  finalScore.textContent = `Skor Akhir: ${score}`;
  highScoreDisplay.textContent = `High Score: ${highScore}`;
}

// --- Menu & Kontrol ---
menuBtn.addEventListener("click", () => {
  if (isGameOver) return;
  isPaused = !isPaused;
  pauseMenu.style.display = isPaused ? "flex" : "none";
  if (!isPaused) gameLoop();
});

resumeBtn.addEventListener("click", () => {
  isPaused = false;
  pauseMenu.style.display = "none";
  gameLoop();
});

restartBtn.addEventListener("click", () => window.location.reload());
restartBtnGameOver.addEventListener("click", () => window.location.reload());
homeBtn.addEventListener("click", () => (window.location.href = "index.html"));

// --- Start Game ---
setInterval(() => {
  if (!isGameOver && !isPaused) createEnemy();
}, 1000);

gameLoop();
