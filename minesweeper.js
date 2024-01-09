document.addEventListener('DOMContentLoaded', function () {
    
    let minesweeperMatrix = []; // current matrix is sotred here

   let currentStepIndex = 0; 

   
    // Function to create Minesweeper board
    function createBoard() {
        console.log("Creating Minesweeper board again");
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
    
        for (let i = 0; i < minesweeperMatrix.length; i++) {
            const rowElement = document.createElement('tr');
            for (let j = 0; j < minesweeperMatrix[i].length; j++) {
                const cellElement = document.createElement('td');
                
                // Check the value in the current cell
                const cellValue = minesweeperMatrix[i][j];
                
                // Set the text content based on the cell value
                if (cellValue === 'E' || cellValue === 'M' ){
                    // For 'E', 'M', or numbers, show an empty cell
                    cellElement.textContent = '';
                } else if ( Number.isInteger(parseInt(cellValue))) {
                    // For  numbers, simulate an opened cell appearance with the number value and color 
                    cellElement.textContent = cellValue;
                    console.log('Setting color for cell:', cellValue);
                    cellElement.classList.add('opened-cell');
                    cellElement.classList.add('number-' + cellValue);
                } else { // for B an empty opened cell
                    cellElement.textContent = "";
                    cellElement.classList.add('opened-cell');
                }
    
                rowElement.appendChild(cellElement);
            }
            boardElement.appendChild(rowElement);
        }
    
        console.log("Minesweeper board created");
        console.log("Pritned this");
        // setButtonPositions(minesweeperMatrix[0].length * 20);
    }
    // Function to generate solved Minesweeper matrix based on the provided sample matrix
    // function generateSolvedMatrix(sampleMatrix) {
    //     const solvedMatrix = [];

    //     // Check if sampleMatrix is defined
    //     if (sampleMatrix && sampleMatrix.length) {
    //         for (let i = 0; i < sampleMatrix.length; i++) {
    //             const row = [];
    //             for (let j = 0; j < sampleMatrix[i].length; j++) {
    //                 row.push(sampleMatrix[i][j]);
    //             }
    //             solvedMatrix.push(row);
    //         }
    //     }

    //     return solvedMatrix;
    // }
   

    function clearBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
    }

    // Function to initialize Minesweeper matrix and board
    function initializeMinesweeper(sampleMatrix) {
        // Clear the board
        clearBoard();

        // Generate the solved Minesweeper matrix based on the provided sample matrix
        minesweeperMatrix = sampleMatrix;

        
        createBoard();
    }

    // Sample Minesweeper matrices (replace this with your actual matrices)
    const sampleMatrices = [
        [
            ['1', 'B', '3', 'E', 'E', 'E'],
            ['E', '2', 'E', 'E', 'E', 'E'],
            ['E', 'E', 'E', 'E', 'E', 'E'],
            ['E', 'E', 'E', 'E', 'E', 'E'],
            ['E', 'E', 'E', 'E', 'E', 'E'],
            ['E', 'E', 'E', 'E', 'E', 'E']
        ],
        [
            ['1', 'E', '3', '2', '4', 'E'],
            ['E', '2', 'E', 'E', 'E', 'E'],
            ['E', 'E', 'E', 'E', 'E', 'E'],
            ['E', 'E', 'E', 'E', 'E', 'E'],
            ['E', 'E', 'E', 'E', 'E', 'E'],
            ['E', 'E', 'E', 'E', 'E', 'E']
        ]
        // Add more sample matrices as needed
    ];

    // Initialize Minesweeper with the first sample matrix
    
    initializeMinesweeper(sampleMatrices[0]);

    // Function to show the next step in the solution
    function showNextStep() {
        // console.log("Button clicked");
        // console.log("currentStepIndex:" + currentStepIndex );
        // console.log("sample matrices lenght:" + sampleMatrices.length);
        if (currentStepIndex + 1 < sampleMatrices.length) {
            console.log("Test");
            currentStepIndex++;
            let nextRoundMatrix = sampleMatrices[currentStepIndex];
            initializeMinesweeper(nextRoundMatrix);
           
        }
    }

    // Function to show the previous step in the solution
    function showPreviousStep() {
        console.log("Previous clicked");
        console.log(currentStepIndex);
        if (currentStepIndex + 1> 1) {
            currentStepIndex--;
            let nextRoundMatrix = sampleMatrices[currentStepIndex];
            initializeMinesweeper(nextRoundMatrix);
            
        }
    }

    // Event listeners for Next and Previous buttons
    const nextButton = document.getElementById('nextButton');
    const prevButton = document.getElementById('prevButton');

    nextButton.addEventListener('click', showNextStep);
    prevButton.addEventListener('click', showPreviousStep);
});
