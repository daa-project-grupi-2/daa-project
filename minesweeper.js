let flagCount;
let isTimerRunning = false;
let timeElapsed = 0;
let timerInterval;

let flagsDisplay = createDisplayElement("div", "000", "bomb-counter");
let timerDisplay = createDisplayElement("div", "000", "timer");
let emojiCell = createDisplayElement("button", "😀", "reset");

function createDisplayElement(element, text, className = "") {
  const displayElement = document.createElement(element);
  displayElement.textContent = text;
  if (className) {
    displayElement.classList.add(className);
  }
  return displayElement;
}

//  Pjesa kryesore per krijimin e board
function createMinesweeperTable(rows, columns) {
  const gameHeader = document.querySelector(".status-bar");
  const chooseAlgorithm = document.querySelector(".alg");
  const matrix = document.getElementById("matrix");
  const container = document.querySelector(".container");

  gameHeader.innerHTML = "";
  chooseAlgorithm.innerHTML = "";
  matrix.innerHTML = "";

  const bfs = createDisplayElement("button", "BFS", "reset");
  const dfs = createDisplayElement("button", "DFS", "reset");

  gameHeader.appendChild(flagsDisplay); // Append flagsDisplay to gameHeader
  gameHeader.appendChild(emojiCell);
  gameHeader.appendChild(timerDisplay);
  chooseAlgorithm.appendChild(dfs);
  chooseAlgorithm.appendChild(bfs);

  chooseAlgorithm.classList.remove("hidden");
  gameHeader.classList.remove("hidden");
  matrix.classList.remove("hidden");

  const tbody = document.createElement("tbody");

  for (let i = 0; i < rows; i++) {
    const row = tbody.insertRow();
    for (let j = 0; j < columns; j++) {
      const cell = row.insertCell();
      cell.textContent = "";
    }
  }

  matrix.appendChild(tbody);

  const cellWidth = 22;
  container.style.width = `${columns * cellWidth + 20}px`;
}

// Krijimi i easy, intermediate, expert board based on the click
function initializeGame() {
  const container = document.querySelector(".container");

  document.getElementById("size-9").addEventListener("click", function () {
    createMinesweeperTable(9, 9);
    container.classList.remove("hidden");
    flagCount = 10;
    updateFlagDisplay();
    attachCellListeners();
  });

  document.getElementById("size-16").addEventListener("click", function () {
    createMinesweeperTable(16, 16);
    container.classList.remove("hidden");
    flagCount = 40;
    updateFlagDisplay();
    attachCellListeners();
  });

  document.getElementById("size-30").addEventListener("click", function () {
    createMinesweeperTable(16, 32);
    container.classList.remove("hidden");
    flagCount = 99;
    updateFlagDisplay();
    attachCellListeners();
  });
}
// TODO: Timer
/*  Timer Functions  */
function startTimer() {
  isTimerRunning = true;
  timerInterval = setInterval(() => {
    timeElapsed++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
}

function updateTimerDisplay() {
  timerDisplay.textContent = timeElapsed.toString().padStart(3, "0");
}

/* Logjika e klikimit ne cell */
function attachCellListeners() {
  const cells = document.querySelectorAll("td");

  cells.forEach((cell) => {
    cell.addEventListener("click", function () {
      if (!isTimerRunning) {
        startTimer();
      }
    });

    cell.addEventListener("contextmenu", function (event) {
      event.preventDefault(); // Prevent the default browser context menu

      if (!isTimerRunning) {
        startTimer();
      }
      // Toggle flag appearance
      if (cell.classList.contains("flag")) {
        cell.classList.remove("flag");
        flagCount++;
        updateFlagDisplay();
      } else if (!cell.classList.contains("flag") && flagCount > 0) {
        cell.classList.add("flag");
        flagCount--;
        updateFlagDisplay();
      }
    });
  });
}

function updateFlagDisplay() {
  flagsDisplay.textContent = flagCount.toString().padStart(3, "0");
}

//  TODO: Reset Button(emoji)

initializeGame();
