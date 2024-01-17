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
let algorithm;
let currentMode;
let areBombGenerated = false;
let isAlgorithmChoosed = false;

let flagsDisplay = createDisplayElement("div", "000", "bomb-counter");
let timerDisplay = createDisplayElement("div", "000", "timer");
let reset = createDisplayElement("button", "😀", "reset");
let next = createDisplayElement("button", "Next", "reset");
let previous = createDisplayElement("button", "Previous", "reset");
let play = createDisplayElement("button", "Play", "reset");
let pause = createDisplayElement("button", "Pause", "reset");
let randomBtn = createDisplayElement("button", "Random", "reset");
let submitBtn = createDisplayElement("button", "Submit", "reset");
let bfs = createDisplayElement("button", "BFS", "reset");
let dfs = createDisplayElement("button", "DFS", "reset");

randomBtn.classList.add("random-btn");

//Get solution after submit without executing matrix_manip.php manually
function ajaxCallMatrix() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Do nothing with the response
    }
  };
  xmlhttp.open("GET", "matrix_manip.php", true);
  xmlhttp.send();
}

function bfsListener() {
  algorithm = "BFS";
  console.log("BFS clicked");
  bfs.classList.add("locked");
  dfs.classList.remove("locked");
  isAlgorithmChoosed = true;
}

function dfsListener() {
  algorithm = "DFS";
  console.log("DFS clicked");
  dfs.classList.add("locked");
  bfs.classList.remove("locked");
  isAlgorithmChoosed = true;
}

// EventListeners
function attachButtonListeners() {
  next.addEventListener("click", showNextStep);
  previous.addEventListener("click", showPreviousStep);
  submitBtn.addEventListener("click", submitListener);
  play.addEventListener("click", playButtonListener);
  pause.addEventListener("click", puaseListener);
  randomBtn.addEventListener("click", randomMatrix);
  bfs.addEventListener("click", bfsListener);
  dfs.addEventListener("click", dfsListener);
  reset.addEventListener("click", restartGame);

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

function submitListener() {
  if (!areBombGenerated || !isAlgorithmChoosed) {
    console.log("Please generate the initial minesweeper table first.");
    return;
  }
  sendData();
  submitAndFetch();
  currentStepIndex = 0;
  areBombGenerated = false;
}

function restartGame() {
  console.log("Reset clicked");

  clearGameData();
  stopTimer();
  clearCookies();
  submitBtn.disabled = false;

  // Reset variables
  flagCount = 0;
  isTimerRunning = false;
  timeElapsed = 0;
  clearInterval(timerInterval);
  isPlaying = false;
  clearInterval(playInterval);
  sampleMatrices = [];
  minesweeperMatrix = [];
  currentStepIndex = 0;
  isBoardGenerated = false;
  areBombGenerated = false;
  isAlgorithmChoosed = false;

  timerDisplay.textContent = "000";

  document.getElementById("matrix").innerHTML = "";

  if (currentMode === "easy") {
    createMinesweeperTable(9, 9);
    flagCount = 10;
    updateFlagDisplay();
  } else if (currentMode === "intermediate") {
    createMinesweeperTable(16, 16);
    flagCount = 40;
    updateFlagDisplay();
  } else {
    createMinesweeperTable(16, 30);
    flagCount = 99;
    updateFlagDisplay();
  }
  initializeGame();
}

// Logic for submit button
function sendData() {
  const matrixData = getMatrixData();
  console.log(matrixData);
  sendMatrixToServer(matrixData, algorithm);
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

function sendMatrixToServer(matrixData, algorithm) {
  const jsonData = JSON.stringify(matrixData);
  // Set JSON string to a cookie
  document.cookie = `matrixData=${jsonData}`;
  document.cookie = `algorithm=${algorithm}`;
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
    submitBtn.disabled = false;

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

  areBombGenerated = true;
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

  gameHeader.appendChild(flagsDisplay);
  gameHeader.appendChild(reset);
  gameHeader.appendChild(timerDisplay);
  chooseAlgorithm.appendChild(dfs);
  chooseAlgorithm.appendChild(bfs);
  functionalityButtons.appendChild(randomBtn);
  functionalityButtons.appendChild(play);
  functionalityButtons.appendChild(submitBtn);
  nextPrvBtn.appendChild(previous);
  nextPrvBtn.appendChild(pause);
  nextPrvBtn.appendChild(next);

  play.classList.add("red-text");
  play.disabled = true;
  pause.classList.add("red-text");

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

    currentMode = "easy";
  });

  document.getElementById("size-16").addEventListener("click", function () {
    createMinesweeperTable(16, 16);
    container.classList.remove("hidden");
    flagCount = 40;
    updateFlagDisplay();

    currentMode = "intermediate";
  });

  document.getElementById("size-30").addEventListener("click", function () {
    createMinesweeperTable(16, 30);
    container.classList.remove("hidden");
    flagCount = 99;
    updateFlagDisplay();

    currentMode = "expert";
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
  timeElapsed = 0;
  timerDisplay.textContent = "000";
  sampleMatrices = [];
  currentStepIndex = 0;
  isPlaying = false;
  clearInterval(playInterval);
  if (playButtonListener) {
    play.removeEventListener("click", playButtonListener);
  }
  if (submitListener) {
    submitBtn.removeEventListener("click", submitListener);
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
  console.log("Update matrix");
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

function updateMinesweeperFlags(matrix) {
  const tbody = document.querySelector("#matrix tbody");
  tbody.innerHTML = "";
  for (let i = 0; i < matrix.length; i++) {
    const rowElement = tbody.insertRow();
    for (let j = 0; j < matrix[i].length; j++) {
      const cellElement = rowElement.insertCell();
      const cellValue = matrix[i][j];
      if (cellValue === "M") {
        cellElement.classList.add("flag");
      } else if (cellValue === "E") {
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
    updateMinesweeperFlags(minesweeperMatrix);
    console.log("This is printed");
    stopPlaying();
    stopTimer();
  }
}

function startPlaying() {
  isPlaying = true;
  console.log("Stert playing function");
  if (currentMode === "easy") {
    stepInterval(120);
  } else if (currentMode === "intermediate") {
    stepInterval(70);
  } else {
    stepInterval(50);
  }
}
function stepInterval(intervalTime) {
  playInterval = setInterval(() => {
    console.log("Interval Triggered");
    try {
      playStepsAutomatically();
    } catch (error) {
      console.error("Error in playStepsAutomatically:", error);
      stopPlaying();
    }
  }, intervalTime);
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
    stopTimer();
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
  submitBtn.disabled = true;
  ajaxCallMatrix();
  setTimeout(() => {
    fetchGameSolution()
      .then(() => {
        console.log(isPlaying);
        console.log(sampleMatrices.length);
        console.log(currentStepIndex);
        console.log(playInterval);
        play.disabled = false;
        play.classList.remove("red-text");
        play.classList.add("green-text");
      })
      .catch((error) => {
        console.error("Error fetching game solution:", error);
      });
  }, 1000); // Adjust the delay as needed
}

async function fetchGameSolution() {
  try {
    const response = await fetch("solution.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("JSON data successfully fetched:", data);

    sampleMatrices = [];

    data.forEach((step) => {
      sampleMatrices.push(step.matrix);
    });
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

function playButtonListener() {
  if (!isPlaying) {
    startPlaying();
    startTimer();
  }
}

function clearCookies() {
  cookies = document.cookie.split("; ").map((a) => a.split("=")[0]);
  for (var i in cookies) {
    document.cookie = cookies[i] + "=;expires=" + new Date(0).toUTCString();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var howToPlayButton = document.getElementById("howToPlayButton");
  var howToPlayModal = document.getElementById("howToPlayModal");
  var closeButton = document.getElementsByClassName("close")[0];

  howToPlayButton.addEventListener("click", function () {
    howToPlayModal.style.display = "block";
  });
  closeButton.addEventListener("click", function () {
    howToPlayModal.style.display = "none";
  });
  window.addEventListener("click", function (event) {
    if (event.target == howToPlayModal) {
      howToPlayModal.style.display = "none";
    }
  });
});

clearCookies();
initializeGame();
