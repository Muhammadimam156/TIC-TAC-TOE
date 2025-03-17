const startMenu = document.getElementById('start-menu');
const gameContainer = document.getElementById('game-container');
const singlePlayerButton = document.getElementById('single-player');
const multiPlayerButton = document.getElementById('multi-player');
const board = document.querySelector('.board');
const statusText = document.querySelector('.status');
const resetButton = document.querySelector('.reset-button');
const cells = document.querySelectorAll('.cell');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');
const timeLeftElement = document.getElementById('time-left');
const themeToggle = document.querySelector('.theme-toggle');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let scoreX = 0;
let scoreO = 0;
let timeLeft = 30;
let timer;
let isSinglePlayer = false;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Start Menu Logic
singlePlayerButton.addEventListener('click', () => {
  startMenu.style.display = 'none';
  gameContainer.style.display = 'block';
  isSinglePlayer = true;
  startGame();
});

multiPlayerButton.addEventListener('click', () => {
  startMenu.style.display = 'none';
  gameContainer.style.display = 'block';
  isSinglePlayer = false;
  startGame();
});

// CPU Move Logic
function makeCPUMove() {
  const emptyCells = gameState
    .map((cell, index) => (cell === '' ? index : null))
    .filter((cell) => cell !== null);

  // Try to win or block the player
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] === 'O' && gameState[b] === 'O' && gameState[c] === '') {
      gameState[c] = 'O';
      cells[c].textContent = 'O';
      cells[c].classList.add('o');
      checkForWinner();
      return;
    }
    if (gameState[a] === 'X' && gameState[b] === 'X' && gameState[c] === '') {
      gameState[c] = 'O';
      cells[c].textContent = 'O';
      cells[c].classList.add('o');
      checkForWinner();
      return;
    }
  }

  // If no winning or blocking move, make a random move
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const cpuMove = emptyCells[randomIndex];

  gameState[cpuMove] = 'O';
  cells[cpuMove].textContent = 'O';
  cells[cpuMove].classList.add('o');

  checkForWinner();
}

// Game Logic
function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[clickedCellIndex] !== '' || !gameActive) return;

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.classList.add(currentPlayer === 'X' ? 'x' : 'o');

  checkForWinner();

  if (isSinglePlayer && gameActive && currentPlayer === 'O') {

    setTimeout(makeCPUMove, 500); // CPU makes a move after a short delay
  }
}

function checkForWinner() {
  let roundWon = false;

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') continue;
    if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
      roundWon = true;
      document.querySelector(`[data-index="${a}"]`).classList.add('winning-cell');
      document.querySelector(`[data-index="${b}"]`).classList.add('winning-cell');
      document.querySelector(`[data-index="${c}"]`).classList.add('winning-cell');
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `Player ${currentPlayer} Wins! 🎉`;
    updateScore(currentPlayer);
    gameActive = false;
    clearInterval(timer);
    return;
  }

  if (!gameState.includes('')) {
    statusText.textContent = "It's a Tie! 🤝";
    gameActive = false;
    clearInterval(timer);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
  resetTimer();
}

function updateScore(winner) {
  if (winner === 'X') scoreX++;
  else if (winner === 'O') scoreO++;

  scoreXElement.textContent = scoreX;
  scoreOElement.textContent = scoreO;
  localStorage.setItem('scoreX', scoreX);
  localStorage.setItem('scoreO', scoreO);
}

function resetGame() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o', 'winning-cell');
  });
  resetTimer();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timeLeftElement.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timer);
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      statusText.textContent = `Player ${currentPlayer}'s Turn`;
      resetTimer();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 30;
  timeLeftElement.textContent = timeLeft;
  startTimer();
}

function toggleTheme() {
  document.body.classList.toggle('light-theme');
  themeToggle.textContent = document.body.classList.contains('light-theme') ? 'Dark Mode' : 'Light Mode';
}

// Load scores from localStorage
scoreX = parseInt(localStorage.getItem('scoreX')) || 0;
scoreO = parseInt(localStorage.getItem('scoreO')) || 0;
scoreXElement.textContent = scoreX;
scoreOElement.textContent = scoreO;

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
themeToggle.addEventListener('click', toggleTheme);
startTimer();