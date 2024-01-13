let flagCount;
let isTimerRunning = false;
let timeElapsed = 0;
let timerInterval;
let isBoardGenerated = false;

let flagsDisplay = createDisplayElement("div", "000", "bomb-counter");
let timerDisplay = createDisplayElement("div", "000", "timer");
let emojiCell = createDisplayElement("button", "😀", "reset");
const randomBtn = createDisplayElement("button", "random", "reset");

//  Logic for random button
randomBtn.classList.add("random-btn");
randomBtn.addEventListener("click", function () {
  if (isBoardGenerated) {
    const rows = document
      .getElementById("matrix")
      .querySelector("tbody").childElementCount;
    const columns = document
      .getElementById("matrix")
      .querySelector("tr").childElementCount;
    const mineCount = calculateMineCount(rows, columns);
    createRandomMinesweeperBoard(rows, columns, mineCount);
    flagCount = mineCount;
    updateFlagDisplay();
    attachCellListeners();
  } else {
    console.log("Please create the initial minesweeper table first.");
  }
});

function calculateMineCount(rows, columns) {
  // Adjust mine count based on difficulty levels
  if (rows === 9 && columns === 9) {
    return 10; // Easy mode
  } else if (rows === 16 && columns === 16) {
    return 40; // Intermediate mode
  } else if (rows === 16 && columns === 32) {
    return 99; // Expert mode
  } else {
    return Math.floor((rows * columns) / 5);
  }
}

function createRandomMinesweeperBoard(rows, columns, mineCount) {
  const matrix = document.getElementById("matrix").querySelector("tbody");

  matrix.innerHTML = "";

  const emptyMatrix = Array.from({ length: rows }, () =>
    Array(columns).fill(0)
  );

  for (let i = 0; i < mineCount; i++) {
    let row, col;
    do {
      row = Math.floor(Math.random() * rows);
      col = Math.floor(Math.random() * columns);
    } while (emptyMatrix[row][col] === 9); // 9 represents a mine

    emptyMatrix[row][col] = 9; // Set mine
  }

  // Display the matrix on the table
  for (let i = 0; i < rows; i++) {
    const rowElement = matrix.insertRow();
    for (let j = 0; j < columns; j++) {
      const cellElement = rowElement.insertCell();
      const cellValue = emptyMatrix[i][j];

      // Display mines with 'M', and empty cells with ''
      cellElement.textContent = cellValue === 9 ? "M" : "";
    }
  }
}

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
  const functionalityButtons = document.querySelector(".functionality-buttons");
  const matrix = document.getElementById("matrix");
  const container = document.querySelector(".container");

  gameHeader.innerHTML = "";
  chooseAlgorithm.innerHTML = "";
  matrix.innerHTML = "";
  functionalityButtons.innerHTML = "";

  const bfs = createDisplayElement("button", "BFS", "reset");
  const dfs = createDisplayElement("button", "DFS", "reset");

  gameHeader.appendChild(flagsDisplay); // Append flagsDisplay to gameHeader
  gameHeader.appendChild(emojiCell);
  gameHeader.appendChild(timerDisplay);
  chooseAlgorithm.appendChild(dfs);
  chooseAlgorithm.appendChild(bfs);
  functionalityButtons.appendChild(submitBtn);
  functionalityButtons.appendChild(randomBtn);

  chooseAlgorithm.classList.remove("hidden");
  gameHeader.classList.remove("hidden");
  matrix.classList.remove("hidden");
  functionalityButtons.classList.remove("hidden");

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

  isBoardGenerated = true;
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