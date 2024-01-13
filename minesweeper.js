let flagCount;
let isTimerRunning = false;
let timeElapsed = 0;
let timerInterval;
let isPlaying = false;
let playInterval;

let sampleMatrices = [];
let minesweeperMatrix = []; // current matrix to be displayed
let currentStepIndex = 0; 

let flagsDisplay = createDisplayElement("div", "000", "bomb-counter");
let timerDisplay = createDisplayElement("div", "000", "timer");
let emojiCell = createDisplayElement("button", "😀", "reset"); 
let next = createDisplayElement("button", "Next", "reset");
let previous = createDisplayElement("button", "Previous", "reset");
let play = createDisplayElement("button", "Play", "reset" );
let submitBtn = createDisplayElement("button", "Submit", "reset");




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
  clearGameData();
  const gameHeader = document.querySelector(".status-bar");
  const chooseAlgorithm = document.querySelector(".alg");
  const functionalityButtons = document.querySelector(".functionality-buttons");
  const nextPrvBtn = document.querySelector(".next-previous-btn");
  const matrix = document.getElementById("matrix");
  const container = document.querySelector(".container");

  gameHeader.innerHTML = "";
  chooseAlgorithm.innerHTML = "";
  matrix.innerHTML = "";
  functionalityButtons.innerHTML = "";
  nextPrvBtn.innerHTML = "";

  const bfs = createDisplayElement("button", "BFS", "reset");
  const dfs = createDisplayElement("button", "DFS", "reset");
  

  gameHeader.appendChild(flagsDisplay); // Append flagsDisplay to gameHeader
  gameHeader.appendChild(emojiCell);
  gameHeader.appendChild(timerDisplay);
  chooseAlgorithm.appendChild(dfs);
  chooseAlgorithm.appendChild(bfs);
  functionalityButtons.appendChild(submitBtn);
  functionalityButtons.appendChild(play);
  nextPrvBtn.appendChild(next);
  nextPrvBtn.appendChild(previous);

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

function clearGameData() {
  sampleMatrices = [];
  currentStepIndex = 0;
  isPlaying = false;
  clearInterval(playInterval);
  if(submitButtonListener) {
    play.removeEventListener('click', submitButtonListener);
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

  // Clear existing rows
  tbody.innerHTML = "";

  for (let i = 0; i < matrix.length; i++) {
    const rowElement = tbody.insertRow();
    for (let j = 0; j < matrix[i].length; j++) {
        const cellElement = rowElement.insertCell();
        
        // Check the value in the current cell
        const cellValue = matrix[i][j];
        
        // Set the text content based on the cell value
        if (cellValue === 'E' || cellValue === 'M'  ){
            // For 'E', 'M', or numbers, show an empty cell
            cellElement.textContent = '';
        }
          
        
        else if ( Number.isInteger(parseInt(cellValue))) {
            // For  numbers, simulate an opened cell appearance with the number value and color 
            cellElement.textContent = cellValue;
          
            cellElement.classList.add('opened-cell');
            cellElement.classList.add('number-' + cellValue);
        } else { // for B an empty opened cell
            cellElement.textContent = "";
            cellElement.classList.add('opened-cell');
        }

        
    }
  
}


}


function playStepsAutomatically() {
  console.log("Before automatic play", sampleMatrices.length, currentStepIndex);
  if (sampleMatrices.length > 0 && currentStepIndex + 1 < sampleMatrices.length) {
    
    currentStepIndex++;

    minesweeperMatrix = sampleMatrices[currentStepIndex];
    updateMinesweeperCells(minesweeperMatrix);
    console.log("After automatic play", sampleMatrices.length, currentStepIndex);
  } else {
    console.log("This is printed");
    stopPlaying();  // Stop playing when reaching the end or if no matrices are available
  }
}

function startPlaying() {

  isPlaying = true;
  console.log("Stert playing function");
  playInterval = setInterval(() => {
    console.log('Interval Triggered');
    try {
      playStepsAutomatically();
    } catch (error) {
      console.error('Error in playStepsAutomatically:', error);
      stopPlaying();  // Stop the interval in case of an error
    }
  }, 500);  // Change the interval as needed (e.g., 1000ms = 1 second)

}

function stopPlaying() {
  console.log("Stop playingfunction ")
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


/* Funksioni per te kaluar ne matricen e radhes*/
function showNextStep() {

  if(currentStepIndex + 1 < sampleMatrices.length) {
   
    currentStepIndex++;
    
      minesweeperMatrix = sampleMatrices[currentStepIndex];
      updateMinesweeperCells(minesweeperMatrix);

     
  }
}

/*Funksioni per te kaluar nje hap mbrapa */
function showPreviousStep() {
 
  if (currentStepIndex + 1> 1) {
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
      // Other code dependent on sampleMatrices can go here
    })
    .catch(error => {
      console.error('Error fetching game solution:', error);
    });
}
// Sample to test the funcionality:


function fetchGameSolution() {
  return fetch('solution.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('JSON data successfully fetched:', data);

      // Clear existing values in sampleMatrices if needed
      sampleMatrices = [];

      // Iterate over each step in the JSON data
      data.forEach(step => {
        // Extract the 'matrix' array from each step and add it to sampleMatrices
        sampleMatrices.push(step.matrix);
      });
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

function attachButtonListeners() {
  next.addEventListener('click', showNextStep);
previous.addEventListener('click',showPreviousStep);
submitBtn.addEventListener('click', submitAndFetch);
play.addEventListener('click', submitButtonListener)


document.addEventListener('keydown', function(event) {
  if (event.key === 'p' || event.key === 'P') {
    stopPlaying();
  }
});

}


function submitButtonListener() {
  if(!isPlaying) {
    startPlaying();
  }else {
    stopPlaying();
  }
}

//  TODO: Reset Button(emoji)

initializeGame();