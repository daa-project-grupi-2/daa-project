let flagCount;
let isTimerRunning = false;
let timeElapsed = 0;
let timerInterval;
let isPlaying = false;
let playInterval;
let sampleMatrices = [];
let minesweeperMatrix = [];
let currentStepIndex = 0;
let isBoardGenerated = false;

let flagsDisplay = createDisplayElement("div", "000", "bomb-counter");
let timerDisplay = createDisplayElement("div", "000", "timer");
let emojiCell = createDisplayElement("button", "😀", "reset");
let next = createDisplayElement("button", "Next", "reset");
let previous = createDisplayElement("button", "Previous", "reset");
let play = createDisplayElement("button", "Play", "reset");
let pause = createDisplayElement("button", "Pause", "reset");
let randomBtn = createDisplayElement("button", "Random", "reset");
let submitBtn = createDisplayElement("button", "Submit", "reset");

randomBtn.classList.add("random-btn");

// EventListeners
function attachButtonListeners() {
  next.addEventListener("click", showNextStep);
  previous.addEventListener("click", showPreviousStep);
  submitBtn.addEventListener("click", submitAndFetch);
  submitBtn.addEventListener("click", sendData);
  play.addEventListener("click", playButtonListener);
  pause.addEventListener("click", puaseListener);
  randomBtn.addEventListener("click", randomMatrix);

  document.addEventListener("keydown", function (event) {
    if (event.key === "p" || event.key === "P") {
      if (!isPlaying) {
        startPlaying();
      } else {
        stopPlaying();
      }
    }
  });
}

// Logic for submit button
function sendData() {
  const matrixData = getMatrixData();
  console.log(matrixData);
  sendMatrixToServer(matrixData);
}

function getMatrixData() {
  const matrixRows = document.querySelectorAll("#matrix tbody tr");
  const matrixData = [];
  matrixRows.forEach((row) => {
    const rowData = [];
    const cells = row.querySelectorAll("td");
    cells.forEach((cell) => {
      const cellContent = cell.textContent.trim();
      const backgroundImage = cell.style.backgroundImage;

      if (backgroundImage && backgroundImage.includes("bomb-emoji")) {
        rowData.push("M");
      } else {
        const cellValue = cellContent === "E" ? "E" : parseInt(cellContent, 10);
        rowData.push(isNaN(cellValue) ? "E" : cellValue);
      }
    });
    matrixData.push(rowData);
  });
  return { matrixData: matrixData };
}
function sendMatrixToServer(matrixData) {
  const jsonData = JSON.stringify(matrixData);
  // Set JSON string to a cookie
  document.cookie = `matrixData=${jsonData}`;
}

//  Logic for random button
function randomMatrix() {
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
}
function calculateMineCount(rows, columns) {
  if (rows === 9 && columns === 9) {
    return 10; // Easy mode
  } else if (rows === 16 && columns === 16) {
    return 40; // Intermediate mode
  } else if (rows === 16 && columns === 30) {
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

      if (cellValue === 9) {
        cellElement.style.backgroundImage =
          'url("https://static-00.iconduck.com/assets.00/bomb-emoji-1959x2048-vuy7ly1m.png")';
        cellElement.style.backgroundSize = "contain";
        cellElement.innerHTML = "";
      }
    }
  }
}

//  Pjesa kryesore per krijimin e board
function createMinesweeperTable(rows, columns) {
  clearGameData();
  const gameHeader = document.querySelector(".status-bar");
  const chooseAlgorithm = document.querySelector(".alg");
  const functionalityButtons = document.querySelector(".functionality-buttons");
  const nextPrvBtn = document.querySelector(".next-previous-btn");

  console.log("Board created");

  const matrix = document.getElementById("matrix");
  const container = document.querySelector(".container");

  gameHeader.innerHTML = "";
  chooseAlgorithm.innerHTML = "";
  matrix.innerHTML = "";
  functionalityButtons.innerHTML = "";

  nextPrvBtn.innerHTML = "";

  const bfs = createDisplayElement("button", "BFS", "reset");
  const dfs = createDisplayElement("button", "DFS", "reset");

  gameHeader.appendChild(flagsDisplay);
  gameHeader.appendChild(emojiCell);
  gameHeader.appendChild(timerDisplay);
  chooseAlgorithm.appendChild(dfs);
  chooseAlgorithm.appendChild(bfs);
  functionalityButtons.appendChild(submitBtn);
  functionalityButtons.appendChild(play);
  nextPrvBtn.appendChild(next);
  nextPrvBtn.appendChild(previous);
  nextPrvBtn.appendChild(pause);

  functionalityButtons.appendChild(randomBtn);

  chooseAlgorithm.classList.remove("hidden");
  gameHeader.classList.remove("hidden");
  matrix.classList.remove("hidden");
  functionalityButtons.classList.remove("hidden");
  nextPrvBtn.classList.remove("hidden");

  const tbody = document.createElement("tbody");

  for (let i = 0; i < rows; i++) {
    const row = tbody.insertRow();
    for (let j = 0; j < columns; j++) {
      const cell = row.insertCell();
      cell.textContent = "";
    }
  }

  matrix.appendChild(tbody);

  const cellWidth = 24;
  container.style.width = `${columns * cellWidth + 20}px`;
  attachButtonListeners();

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
    createMinesweeperTable(16, 30);
    container.classList.remove("hidden");
    flagCount = 99;
    updateFlagDisplay();
    attachCellListeners();
  });
}

function createDisplayElement(element, text, className = "") {
  const displayElement = document.createElement(element);
  displayElement.textContent = text;
  if (className) {
    displayElement.classList.add(className);
  }

  return displayElement;
}

function clearGameData() {
  sampleMatrices = [];
  currentStepIndex = 0;
  isPlaying = false;
  clearInterval(playInterval);
  if (playButtonListener) {
    play.removeEventListener("click", playButtonListener);
  }
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

/* Perditesimi i boardid  (perdisteson vetem celulat me vleren e re)*/
function updateMinesweeperCells(matrix) {
  const tbody = document.querySelector("#matrix tbody");

  tbody.innerHTML = "";

  for (let i = 0; i < matrix.length; i++) {
    const rowElement = tbody.insertRow();
    for (let j = 0; j < matrix[i].length; j++) {
      const cellElement = rowElement.insertCell();

      const cellValue = matrix[i][j];

      if (cellValue === "E" || cellValue === "M") {
        cellElement.textContent = "";
      } else if (Number.isInteger(parseInt(cellValue))) {
        cellElement.textContent = cellValue;

        cellElement.classList.add("opened-cell");
        cellElement.classList.add("number-" + cellValue);
      } else {
        cellElement.textContent = "";
        cellElement.classList.add("opened-cell");
      }
    }
  }
}
function playStepsAutomatically() {
  console.log("Before automatic play", sampleMatrices.length, currentStepIndex);
  if (
    sampleMatrices.length > 0 &&
    currentStepIndex + 1 < sampleMatrices.length
  ) {
    currentStepIndex++;

    minesweeperMatrix = sampleMatrices[currentStepIndex];
    updateMinesweeperCells(minesweeperMatrix);
    console.log(
      "After automatic play",
      sampleMatrices.length,
      currentStepIndex
    );
  } else {
    console.log("This is printed");
    stopPlaying();
  }
}

function startPlaying() {
  isPlaying = true;
  console.log("Stert playing function");
  playInterval = setInterval(() => {
    console.log("Interval Triggered");
    try {
      playStepsAutomatically();
    } catch (error) {
      console.error("Error in playStepsAutomatically:", error);
      stopPlaying();
    }
  }, 500);
}

function stopPlaying() {
  console.log("Stop playingfunction ");
  isPlaying = false;
  clearInterval(playInterval);
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
      event.preventDefault();

      if (!isTimerRunning) {
        startTimer();
      }
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
/* Funksioni per te kaluar ne matricen e radhes*/
function showNextStep() {
  if (currentStepIndex + 1 < sampleMatrices.length) {
    currentStepIndex++;

    minesweeperMatrix = sampleMatrices[currentStepIndex];
    updateMinesweeperCells(minesweeperMatrix);
  }
}

/* Funksioni per te puazuar animmacionin*/
function puaseListener() {
  if (isPlaying) {
    stopPlaying();
  }
}

/*Funksioni per te kaluar nje hap mbrapa */
function showPreviousStep() {
  if (currentStepIndex + 1 > 1) {
    currentStepIndex--;
    let nextRoundMatrix = sampleMatrices[currentStepIndex];
    updateMinesweeperCells(nextRoundMatrix);
  }
}

function submitAndFetch() {
  fetchGameSolution()
    .then(() => {
      console.log(isPlaying);
      console.log(sampleMatrices.length);
      console.log(currentStepIndex);
      console.log(playInterval);
    })
    .catch((error) => {
      console.error("Error fetching game solution:", error);
    });
}

function fetchGameSolution() {
  return fetch("solution.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("JSON data successfully fetched:", data);

      sampleMatrices = [];

      data.forEach((step) => {
        sampleMatrices.push(step.matrix);
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function playButtonListener() {
  if (!isPlaying) {
    startPlaying();
  }
}

initializeGame();