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

let flagsDisplay = createDisplayElement("div", "000", "bomb-counter");
let timerDisplay = createDisplayElement("div", "000", "timer");
let emojiCell = createDisplayElement("button", "😀", "reset");
let randomBtn = createDisplayElement("button", "Random", "reset");
let play = createDisplayElement("button", "Play", "reset");
let submitBtn = createDisplayElement("button", "Submit", "reset");
let previous = createDisplayElement("button", "Previous", "reset");
let pause = createDisplayElement("button", "Pause", "reset");
let next = createDisplayElement("button", "Next", "reset");

randomBtn.classList.add("random-btn");

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
}

function dfsListener() {
  algorithm = "DFS";
  console.log("DFS clicked");
  dfs.classList.add("locked");
  bfs.classList.remove("locked");
}

// EventListeners
function attachButtonListeners() {
  next.addEventListener("click", showNextStep);
  previous.addEventListener("click", showPreviousStep);
  submitBtn.addEventListener("click", submitAndFetch);
  submitBtn.addEventListener("click", sendData);

  play.addEventListener("click", function () {
    playButtonListener();
    play.classList.add("play");
    pause.classList.remove("pause");
  });

  pause.addEventListener("click", function () {
    puaseListener();
    pause.classList.add("pause");
    play.classList.remove("play");
  });

  randomBtn.addEventListener("click", function () {
    randomMatrix();
    removePlayPauseColor(); // Remove play/pause color when random button is clicked
  });

  submitBtn.addEventListener("click", function () {
    randomMatrix();
    removePlayPauseColor(); // Remove play/pause color when submit button is clicked
  });
  submitBtn.addEventListener("click", function () {
    sendData();
    submitAndFetch();
    currentStepIndex = 0;
  });
  play.addEventListener("click", playButtonListener);
  pause.addEventListener("click", puaseListener);
  randomBtn.addEventListener("click", randomMatrix);
  bfs.addEventListener("click", bfsListener);
  dfs.addEventListener("click", dfsListener);

  document.addEventListener("keydown", function (event) {
    if (event.key === "p" || event.key === "P") {
      if (!isPlaying) {
        startPlaying();
        removePlayPauseColor();
        play.classList.add("play");
      } else {
        stopPlaying();
        removePlayPauseColor();
        pause.classList.add("pause");
      }
    }
  });
}

function removePlayPauseColor() {
  play.classList.remove("play");
  pause.classList.remove("pause");
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

  gameHeader.appendChild(flagsDisplay);
  gameHeader.appendChild(emojiCell);
  gameHeader.appendChild(timerDisplay);
  chooseAlgorithm.appendChild(dfs);
  chooseAlgorithm.appendChild(bfs);
  functionalityButtons.appendChild(randomBtn);
  functionalityButtons.appendChild(play);
  functionalityButtons.appendChild(submitBtn);
  nextPrvBtn.appendChild(previous);
  nextPrvBtn.appendChild(pause);
  nextPrvBtn.appendChild(next);

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
  const openedCellsList = document.getElementById("openedCellsList");

  tbody.innerHTML = "";
  openedCellsList.innerHTML = "";

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
        openedCellsList.innerHTML += `<li>Clicked at row ${i}, col ${j}</li>`;
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
  document.getElementById('cell-list').classList.remove('hidden');
}

function stopPlaying() {
  console.log("Stop playingfunction ");
  isPlaying = false;
  clearInterval(playInterval);
}

/* Logjika e klikimit ne cell */
function attachCellListeners() {
  const cells = document.querySelectorAll("td");
  const clickedCellInfo = document.getElementById("clickedCellInfo");
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
  ajaxCallMatrix();
  setTimeout(() => {
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
  }
}
//how to play button
document.addEventListener("DOMContentLoaded", function() {
  var howToPlayButton = document.getElementById("howToPlayButton");
  var howToPlayModal = document.getElementById("howToPlayModal");
  var closeButton = document.getElementsByClassName("close")[0];

  howToPlayButton.addEventListener("click", function() {
    howToPlayModal.style.display = "block";
  });

  closeButton.addEventListener("click", function() {
    howToPlayModal.style.display = "none";
  });

  window.addEventListener("click", function(event) {
    if (event.target == howToPlayModal) {
      howToPlayModal.style.display = "none";
    }
  });
});
initializeGame();
